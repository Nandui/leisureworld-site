"""Exercise PHP validation and response branches without sending any email.
Usage: python scripts/test-contact.py /path/to/php
"""
from pathlib import Path
import json,subprocess,sys
root=Path(__file__).resolve().parent.parent
php=sys.argv[1] if len(sys.argv)>1 else 'php'
valid={'fname':'Test','lname':'Visitor','email':'qa@example.invalid','centre':'Bishopstown','enquiry':'Swimming Lessons','message':'Local fixture only.'}
cases=[('valid',{},200,1),('mail failure',{'mail_success':False},503,1),('GET',{'server':{'REQUEST_METHOD':'GET'}},405,0),('oversize body',{'server':{'CONTENT_LENGTH':'25001'}},413,0),('honeypot',{'post':{**valid,'website':'spam'}},400,0),('missing name',{'post':{**valid,'fname':'  '}},422,0),('invalid email',{'post':{**valid,'email':'invalid'}},422,0),('header injection',{'post':{**valid,'email':'qa@example.invalid\r\nBcc: other@example.invalid'}},422,0),('unknown centre',{'post':{**valid,'centre':'elsewhere'}},422,0),('array input',{'post':{**valid,'message':['bad']}},422,0),('long message',{'post':{**valid,'message':'a'*5001}},422,0),('long Unicode name',{'post':{**valid,'fname':'é'*101}},422,0),('invalid recipient',{'recipient':'invalid'},503,0),('teacher training',{'post':{**valid,'enquiry':'Swim Teacher Training'}},200,1),('no JavaScript',{'server':{'HTTP_ACCEPT':'text/html'}},200,1)]
for name,overrides,status,mails in cases:
    data={'post':valid,**overrides}
    proc=subprocess.run([php,'-n','-d','disable_functions=mail',str(root/'scripts/mail-fixture.php')],input=json.dumps(data),text=True,capture_output=True,encoding='utf-8')
    if proc.returncode or proc.stderr:raise AssertionError((name,proc.stderr,proc.stdout))
    result=json.loads(proc.stdout)
    assert result['status']==status,(name,result)
    assert len(result['mail_calls'])==mails,(name,result)
    if name=='no JavaScript':assert '<html lang="en-IE">' in result['body'] and 'Return to the contact page' in result['body']
    else:assert json.loads(result['body'])['success']==(status==200),(name,result)
    assert all(m['to']=='qa@example.invalid' for m in result['mail_calls'])
    print('PASS:',name)
print(f'{len(cases)} handler cases passed. Real mail transport was disabled throughout.')
