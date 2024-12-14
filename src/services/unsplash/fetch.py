import requests
import json
import argparse

# Key для Unsplash API (free demo)
ACCESS_KEY = "LKySL-1OlOv3qvpF0S7YfBamui-zZWc-sHdHo3H90JI"
COLLECTION_IDS = {
    "morning": "JgnKSYwXFYE",  # ID коллекции утро
    "day": "ilG-iu8SLV0",      # ID коллекции день
    "night": "6ZWsxnzbj48"     # ID коллекции ночь
}
OUTPUT_FILES = {
    "morning": "./src/services/unsplash_result_morning.json",
    "day": "./src/services/unsplash_result_day.json",
    "night": "./src/services/unsplash_result_night.json"
}

# Максимальное количество записей за запрос (до 30)
PER_PAGE = 30
TOTAL_RECORDS = 5000  # Количество записей, которые нужно получить

def fetch_unsplash_collection(collection_id, access_key, per_page=30, total_records=5000):
    photos = []
    page = 1
    total_pages = (total_records // per_page) + (1 if total_records % per_page > 0 else 0)

    while len(photos) < total_records:
        print(f"Fetching page {page}...")
        url = f"https://api.unsplash.com/collections/{collection_id}/photos"
        params = {
            "client_id": access_key,
            "per_page": per_page,
            "page": page
        }
        response = requests.get(url, params=params)

        if response.status_code != 200:
            print(f"Error: {response.status_code}, {response.text}")
            break

        data = response.json()

        # Фильтруем только нужные данные
        filtered_data = [
            {
                "urls": photo.get("urls"),
                "links": {"self": photo["links"]["self"]},
                "user": {
                    "name": photo["user"]["name"],
                    "links": {"self": photo["user"]["links"]["self"]}
                }
            }
            for photo in data
        ]
        photos.extend(filtered_data)

        if len(data) < per_page:  # Если получил меньше записей, чем ожидалось
            break

        page += 1
        if page > total_pages:
            break

    return photos[:total_records]

def save_to_json(data, filename):
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fetch photos from Unsplash collections.")
    parser.add_argument("-n", "--name", choices=COLLECTION_IDS.keys(), required=True, help="Specify the time of day: morning, day, or night.")
    args = parser.parse_args()

    collection_id = COLLECTION_IDS[args.name]
    output_file = OUTPUT_FILES[args.name]

    print(f"Fetching data for {args.name}...")
    collection_data = fetch_unsplash_collection(
        collection_id=collection_id,
        access_key=ACCESS_KEY,
        per_page=PER_PAGE,
        total_records=TOTAL_RECORDS
    )
    save_to_json(collection_data, output_file)
    print(f"Data saved to {output_file}")
