Player device

player_device_status -> quando o device do player ligar send o status como on

player_device_game_actions -> quando o player morre e quando a kill é capturada gera um payload e vai acumulando ate estar proximo do respawn [2] 

player_device_game_action_revive -> quando o player 


Respawn Device

recive_data_from_player -> pode ser um array com 2 entry, respawn recebe estes dados e mete numa queu ate ter 30  registos

send_data_to_master -> 



Master device 

revice_data_from    