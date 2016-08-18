import requests
import json
import random

msg_json = {  
	"message":
	{  
		"text":"",
		"attachments":[  
		{  
			"type":"mentions",
			"user_ids":[],
			"loci":[]
		}
		],
		"source_guid": ''.join(random.choice('0123456789ABCDEF') for i in range(16))
	}
}

headers = {"content-type" : "application/json", "X-Access-Token": "xxxxxxxxxxxxxxxxxxxxx"}

get_group_members = requests.get('https://api.groupme.com/v3/groups/{group_id}?token=xxxxxxxxxxxxxxxxxxxx')
get_group_members_json = json.loads(get_group_members.text)
for item in get_group_members_json['response']['members']:
	name = "@" + item['nickname'];
	msg_json['message']['text'] = msg_json['message']['text'] + " " + name 
	pos = msg_json['message']['text'].index(name)
	name_length = len(name)
	msg_json['message']['attachments'][0]['user_ids'].append(item['user_id'])
	msg_json['message']['attachments'][0]['loci'].append([pos, name_length])

r = requests.post('https://api.groupme.com/v3/groups/{group_id}/messages', data=json.dumps(msg_json), headers=headers)
print r.status_code