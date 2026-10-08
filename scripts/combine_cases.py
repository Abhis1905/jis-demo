#!/usr/bin/env python3
import json
import os

from data_cases_part1 import cases_part1
from data_cases_part2 import cases_part2
from data_cases_part3 import cases_part3

with open('/tmp/full_105_with_sections.json', 'r') as f:
    db_cases = json.load(f)

print(f"Total DB cases: {len(db_cases)}")

merged = {}
for k, v in cases_part1.items():
    merged[str(k)] = v
for k, v in cases_part2.items():
    merged[str(k)] = v
for k, v in cases_part3.items():
    merged[str(k)] = v

print(f"Total curated cases in 3 parts: {len(merged)}")

missing = []
for c in db_cases:
    cid_str = str(c['id'])
    if cid_str not in merged:
        missing.append((c['id'], c['case_name']))

if missing:
    print(f"WARNING: {len(missing)} cases missing from curated data:")
    for m in missing:
        print(f"  ID {m[0]}: {m[1]}")
else:
    print("ALL 105 CASES ARE PRESENT AND CURATED!")

# Validation checks on all 105 cases
for cid_str, data in merged.items():
    assert len(data['overview']) > 50, f"Overview too short for ID {cid_str}"
    assert len(data['issues']) > 20, f"Issues too short for ID {cid_str}"
    assert len(data['holding']) > 30, f"Holding too short for ID {cid_str}"
    assert 5 <= len(data['key_findings']) <= 8, f"Key findings count {len(data['key_findings'])} for ID {cid_str} must be between 5 and 8"
    assert len(data['provisions']) >= 1, f"Provisions empty for ID {cid_str}"
    for p in data['provisions']:
        assert 'provision' in p and 'relevance' in p, f"Invalid provision format for ID {cid_str}"

os.makedirs('data', exist_ok=True)
out_path = 'data/case_records.json'
with open(out_path, 'w') as f:
    json.dump(merged, f, indent=2, ensure_ascii=False)

print(f"Successfully saved {len(merged)} cases to {out_path} ({os.path.getsize(out_path)} bytes).")
