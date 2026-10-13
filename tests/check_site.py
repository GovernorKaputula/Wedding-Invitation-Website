"""Guard against duplicate IDs, missing assets and broken fragment links."""
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.local_files, self.fragments = [], [], []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for attribute in ['src', 'href']:
            value = attrs.get(attribute, '')
            if value.startswith('#'):
                self.fragments.append(value[1:])
            elif value and ':' not in value and not value.startswith('//'):
                self.local_files.append(value)

class SiteTest(unittest.TestCase):
    def setUp(self):
        self.page = Page()
        self.page.feed((ROOT / 'index.html').read_text(encoding='utf-8'))
    def test_unique_ids(self):
        self.assertEqual(len(self.page.ids), len(set(self.page.ids)))
    def test_local_assets_exist(self):
        for file in self.page.local_files:
            with self.subTest(file=file):
                self.assertTrue((ROOT / file).is_file())
    def test_anchor_targets_exist(self):
        for target in self.page.fragments:
            self.assertIn(target, self.page.ids)

if __name__ == '__main__':
    unittest.main()

