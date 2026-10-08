#!/usr/bin/env python3
import json
import os

with open('/tmp/full_105_with_sections.json', 'r') as f:
    db_cases = json.load(f)

by_id = {c['id']: c for c in db_cases}
case_records = {}

# Load existing Part 1
with open('scripts/build_full_case_records.py', 'r') as f:
    # We will build the complete unified dictionary directly
    pass

print(f"Loaded {len(db_cases)} cases from DB dump.")
