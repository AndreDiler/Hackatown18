import serial
import time
import requests
import json

ser = serial.Serial('/dev/ttyACM1', 9600)

# Temps en secondes entre les mises à jour
UPDATE_INTERVAL = 5

EMPTY = True
FULL = False

POUBELLE_ID = 3

def notify( state ):
	if state == EMPTY:
		data = {
			"id": "8",
		  	"croisement": "Polytechnique",
			"coordonnees": {
				"latitude": 45.503791,
				"longitude": -73.613585
		  	},
		  	"vide" : True
	  	}
	elif state == FULL: 
		data = {
			"id": "8",
		  	"croisement": "Polytechnique",
			"coordonnees": {
				"latitude": 45.503791,
				"longitude": -73.613585
		  	},
		  	"vide" : False
	  	}
	
	r = requests.put('http://vps504371.ovh.net:5000/poubelles/8', json=data)


# Initialise l'horloge
time.clock() 


start = time.time()
current_state = FULL
previous_state = FULL

while True:
	reading = ser.readline().rstrip()
	print(reading)
		
	value = int(reading)
	isEmpty = (value == 1)

	current_state = current_state or isEmpty
	
	#print("was: " + str(previous_state)
	#		 + " and is now: " + str(current_state))		
	
	elapsed_time = time.time() - start
	if elapsed_time >= UPDATE_INTERVAL:
		if previous_state == FULL and current_state == EMPTY:
			print("La poubelle a été vidée !!!")
			notify( current_state )
		
		if previous_state == EMPTY and current_state == FULL:
			print("La poubelle est pleine !!!")
			notify( current_state )

		start = time.time()
		previous_state = current_state
		current_state = FULL
		
		
		

