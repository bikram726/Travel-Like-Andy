"""Read-only production inventory and isolated responsive previews.

Previews redirect form requests to a local mock; they never email clients.
Run: python scripts/audit_site.py --output C:/path/to/private-audit
"""
import argparse
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from bs4 import BeautifulSoup

PAGES = {'home': '', 'about': 'about', 'bespoke': 'bespoke', 'groups': 'corporate',
         'collections': 'collections', 'contact': 'contact',
         'journal': 'journal', 'access-and-care': 'access-and-care'}
ROOT = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    preview = args.output / 'preview'
    preview.mkdir(exist_ok=True)
    report = []
    footer = (ROOT / 'pages/footer-content.html').read_text(encoding='utf-8')
    for name, slug in PAGES.items():
        url = 'https://www.travellikeandy.com/' + slug
        try:
            with urlopen(Request(url, headers={'User-Agent': 'TravelLikeAndy-SiteAudit/1.0'}), timeout=30) as response:
                raw = response.read().decode('utf-8')
                headers = {k.lower(): v for k, v in response.headers.items()}
                status = response.status
        except HTTPError as error:
            report.append({'page': name, 'url': url, 'status': error.code,
                           'error': str(error), 'preview': 'skipped'})
            error.close()
            continue
        except (URLError, TimeoutError) as error:
            report.append({'page': name, 'url': url, 'status': None,
                           'error': str(error), 'preview': 'skipped'})
            continue
        (args.output / (name + '-production.html')).write_text(raw, encoding='utf-8')
        soup = BeautifulSoup(raw, 'html.parser')
        forms = soup.find_all('form')
        report.append({'page': name, 'url': url, 'status': status,
                       'h1_count': len(soup.find_all('h1')),
                       'pending_notice': 'REGISTRATION PENDING' in soup.get_text(),
                       'mixed_content': [e.get('src') for e in soup.find_all(src=True) if e['src'].startswith('http:')],
                       'unsafe_new_tabs': [e.get('href') for e in soup.select('a[target="_blank"]') if 'noopener' not in e.get('rel', [])],
                       'missing_alt': len(soup.select('img:not([alt])')),
                       'forms': len(forms),
                       'headers': {k: headers.get(k) for k in ['strict-transport-security', 'content-security-policy', 'x-content-type-options', 'x-frame-options', 'referrer-policy']}})
        block = soup.select_one('.sqs-block-code .sqs-block-content')
        if block is None:
            report[-1]['preview'] = 'skipped: no code block found'
            continue
        block.clear()
        page = (ROOT / 'pages' / (name + '.html')).read_text(encoding='utf-8')
        # The mock contains no access key and no outbound form endpoint.
        page = page.replace('https://api.web3forms.com/submit', '/test-submit')
        page = re.sub(r'(<input\b[^>]*name="access_key"[^>]*value=")[^"]*', r'\1local-test-only', page)
        for child in list(BeautifulSoup(page, 'html.parser').contents):
            block.append(child)
        old_footer = soup.select_one('.tla-footer')
        if old_footer:
            old_footer.decompose()
        for child in list(BeautifulSoup(footer, 'html.parser').contents):
            soup.body.append(child)
        (preview / (name + '.html')).write_text(str(soup), encoding='utf-8')
    (args.output / 'http-inventory.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(json.dumps(report, indent=2))

if __name__ == '__main__':
    main()
