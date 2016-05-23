#!/usr/bin/python
import urllib2
import json
import pexpect

response = urllib2.urlopen('http://127.0.0.1/testing.php')
data = json.load(response)   

for json in data:
	
	# os.system('sudo adduser --home /var/www/codefunction/public/' + json['token'] + '/ ' + json['user'], 'default', 'default')
	child = pexpect.spawn('sudo adduser --home /var/www/codefunction/public/' + json['token'] + '/ ' + json['user'])
	
	child.expect('Digite a nova senha UNIX:')
	child.sendline(json['password'])

	child.expect('Redigite a nova senha UNIX:')
	child.sendline(json['password'])

	print child