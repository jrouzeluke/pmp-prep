import json

with open('data/taskData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

mc = data['Manage Conflict']
pmp = mc['learn']['pmp_application']

print('Keys in pmp_application:', list(pmp.keys()))
print('\nHas exam_focus:', 'exam_focus' in pmp)

if 'exam_focus' in pmp:
    ef = pmp['exam_focus']
    print('exam_focus keys:', list(ef.keys()))
    if 'sample_questions' in ef:
        q = ef['sample_questions']
        print(f'\n✅ Found {len(q)} sample questions')
        print(f'First: {q[0]["question"][:50]}...')
        print(f'Last: {q[-1]["question"][:50]}...')
        print(f'All have correct: {all("correct" in qq for qq in q)}')
        print(f'All have explanation: {all("explanation" in qq for qq in q)}')
    else:
        print('sample_questions NOT in exam_focus')
else:
    print('exam_focus NOT in pmp_application')
    # Try to find it elsewhere
    import json as j
    s = j.dumps(pmp, indent=2)
    if 'exam_focus' in s:
        print('But exam_focus found in JSON string - structure issue?')
