import os
import re
import unicodedata
from pytube import YouTube
import ffmpeg

musicFolder = "./musics/"
resultFolder = "./results/"

musicURLs = []

import sys
if (len(sys.argv) > 1):
    musicURLs.append(sys.argv[1])
else:
    exit(1)


def convert_to_filename_safe(text):
    # Normalize to NFKD form to handle decomposed characters
    normalized_text = unicodedata.normalize('NFKD', text)
    
    # Replace non-ASCII characters with their closest ASCII equivalents
    ascii_text = ''.join([c for c in normalized_text if not unicodedata.combining(c)])
    
    # Replace any remaining special characters and spaces with underscores
    safe_text = re.sub(r'[^\w\s-]', '_', ascii_text)
    
    # Remove leading and trailing spaces and underscores
    safe_text = safe_text.strip('_ ')
    
    return safe_text

for musicURL in musicURLs:
    yt = YouTube(musicURL)

    audio_stream = yt.streams.filter(only_audio=True, file_extension='mp4').first()

    title_encoded = convert_to_filename_safe(yt.title)

    if (not os.path.exists(musicFolder + title_encoded + ".mp4")):
        filename = title_encoded + ".mp4"
        audio_stream.download(output_path=musicFolder, filename=filename)

    if (not os.path.exists(musicFolder + title_encoded + ".mp3")):
        input_file = f'{musicFolder}{title_encoded}.mp4'
        output_file = f'{musicFolder}{title_encoded}.mp3'
        ffmpeg.input(input_file).output(output_file).run()

    if (not os.path.exists(resultFolder + title_encoded + "_Instruments.wav") and not os.path.exists(resultFolder + title_encoded + "_Vocals.wav")):
        commandToConvert = "py interference.py --input \".\\musics\\" + title_encoded + ".mp3\" --output_dir \"" + resultFolder + "\" --tta --gpu 0"
        os.system(commandToConvert)

print("Done.")