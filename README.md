# Happy Birthday, Cassidy

This site is a little love letter built as an interactive birthday experience.
It is part scrapbook, part playlist, part timeline, and all heart.

## Private access (optional)

This is a static site, so there is no true server login. You can add a **question + answer gate**: she sees a question only she can answer, and the site unlocks if the answer matches (after trim + lowercase).

1. Pick a question and the exact answer she should type (e.g. a place, inside joke, date).

2. Hash the **answer** (not the question). The script normalizes the same way the site does (`trim` + `lowercase`):

   ```bash
   npm run hash-passphrase -- "her answer here"
   ```

3. In `.env.local` (and never commit it):

   - `VITE_SITE_ACCESS_HASH=` the printed hex  
   - `VITE_SITE_ACCESS_QUESTION=` the question text (plain text is fine)

4. In GitHub **Settings → Secrets and variables → Actions**, add:

   - `VITE_SITE_ACCESS_HASH`  
   - `VITE_SITE_ACCESS_QUESTION`  

   The deploy workflow passes both into the build.

5. Redeploy. Unlock lasts for that browser tab via `sessionStorage`.

**Honest limitation:** anyone who can read your built JavaScript sees the question and hash; a weak answer could be guessed. For stronger protection, use [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) or similar in front of Pages.

## What this is

A custom page made to celebrate Cassidy, with:

- a song picker and persistent music player
- a quote and profile card
- a photo carousel
- a timeline of key memories
- a 3x3 "things that remind me of you" grid
- a closing signature message

## For Cass

If you are reading this, this whole site exists because of you.

Every section was made with intention, from the colors to the little details,
so it could feel personal instead of generic. You have brought a lot of joy
into my life, and this is one small way of saying thank you.

Happy Birthday.

Love,  
Mike
