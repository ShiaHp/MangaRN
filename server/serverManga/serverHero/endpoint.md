<!-- get cover art -->
https://api.mangadex.org/cover/5c387308-bdf3-4310-a90c-193d322a1cd8
https://api.mangadex.org/cover/:id

results:
{
    "result": "ok",
    "response": "entity",
    "data": {
        "id": "5c387308-bdf3-4310-a90c-193d322a1cd8",
        "type": "cover_art",
        "attributes": {
            "description": "",
            "volume": "7",
            "fileName": "a8d56b42-855a-4852-b7c5-8bf2606dc5b5.jpg",
            "locale": "ja",
            "createdAt": "2023-01-02T16:38:49+00:00",
            "updatedAt": "2023-01-02T16:38:49+00:00",
            "version": 1
        },
        "relationships": [
            {
                "id": "0e8fac17-979e-4e37-8f45-2c334b25d6dd",
                "type": "manga"
            },
            {
                "id": "0218ac4d-c69e-4670-8ea0-3bb161a3ef8d",
                "type": "user"
            }
        ]
    }
}




<!-- Get list chapter -->
https://api.mangadex.org/manga/0e8fac17-979e-4e37-8f45-2c334b25d6dd/feed
https://api.mangadex.org/manga/:idManga/feed

results:
{

}
GET /manga/{id}/feed Will list all Chapter for a given Manga
GET /user/follows/manga/feed Will list all Chapter for your followed Manga
GET /list/{id}/feed Will list all Chapter for a given CustomList


<!-- Tổng trang truyện trong 1 chap -->

https://api.mangadex.org/at-home/server/94847714-49f5-48c4-9fac-cf9bc12e0032
