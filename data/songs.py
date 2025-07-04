import requests
import json
resp = requests.get('https://dp4p6x0xfi5o9.cloudfront.net/chunithm/data.json')
data = resp.json()

with open('data/songs.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

IMAGE_BASE_URL = 'https://dp4p6x0xfi5o9.cloudfront.net/chunithm/img/cover/'
songs_json = {'songs': []}
for song_data in data['songs']:
    _, category, title, artist, bpm, image, _, _, _, _, _, sheets = list(song_data.values())
    if category == "WORLD'S END": continue # Skip WE charts
    difficulties = [3, 4] # MAS, ULT
    
    for diff in difficulties:
        if diff >= len(sheets): continue # No ULT
        # Retrieve sheet details
        sheet = sheets[diff]
        _, diff_name, display_level, _, _, internal_level, note_designer, note_count, regions, _ = list(sheet.values())

        # Not available in international ver.
        if regions['intl'] == False: continue

        # Append sheet to list
        song_item = {
            # Song info
            'song': title,
            'category': category,
            'artist': artist, 
            'bpm': bpm,
            'imageLink': IMAGE_BASE_URL + image,
            # Chart info
            'diffName': diff_name.upper(),
            'displayLevel': display_level,
            'internalLevel': float(internal_level),
            'noteDesigner': note_designer,
            'noteCount': note_count['total'],
        }
        songs_json['songs'].append(song_item)

with open('song-randomiser/src/assets/songs.json', 'w', encoding='utf-8') as f:
    json.dump(songs_json, f, ensure_ascii=False, indent=4)

print(f"File written. ({len(songs_json['songs'])} songs)")