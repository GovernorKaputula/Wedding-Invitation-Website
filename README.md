# Mwila & Chama

A wedding invitation and keepsake for **29 November 2025, Lusaka**. An ivory and burgundy layout pairs the couple’s original photographs with the ceremony schedule, venue directions and family contacts.

[View the website](https://governorkaputula.github.io/Wedding-Invitation-Website/)

## Run locally

```sh
python -m http.server 4175 --bind 127.0.0.1
```

Open `http://127.0.0.1:4175`. No build step or application dependencies are required. JavaScript modules require an HTTP server; opening the HTML directly from the filesystem is not supported.

## Behaviour

- Responsive layout, visible keyboard focus and reduced-motion support.
- Six-photo gallery with previous/next controls, arrow keys, Escape to close, and focus restored to the selected thumbnail. Without JavaScript, the image links still work.
- All date calculations use Zambia’s UTC+2 offset. The page distinguishes the countdown, wedding day, and keepsake states.
- RSVPs close at the end of 15 November 2025, Zambia time. The current page intentionally shows a closed message and family contacts.
- The original Google Apps Script endpoint is retained in `script.js`. When open, the form prevents duplicate pending requests, times out after 15 seconds and preserves entered details if confirmation fails. Declined invitations record zero attending guests. Only an explicit JSON success response is treated as confirmed.

The RSVP backend is external to this repository. No live guest submissions were sent during testing. Server-side deadline enforcement, validation and the endpoint’s response contract must be verified with its owner before reusing the form for another event; a client-side deadline is not access control.

## Files

| File         | Purpose                                          |
| ------------ | ------------------------------------------------ |
| `index.html` | Content, navigation, photo links and RSVP markup |
| `style.css`  | Responsive invitation layout and lightbox styles |
| `script.js`  | Gallery, event state and RSVP handling           |
| `event.js`   | Zambia event timestamps and date/gallery helpers |
| `images/`    | Original couple photographs                      |
| `tests/`     | Deadline, countdown, gallery and document checks |

For a different event, update the visible date, schedule and deadline in `index.html` together with the timestamps in `event.js`. Keep the original event information when maintaining this keepsake.

## Verification

```sh
npm test
python tests/check_site.py
node --check script.js
```

Node 22+ and Python 3 are sufficient. GitHub Actions runs these checks on pushes and pull requests. The browser review covers desktop, narrow screens, gallery wraparound, keyboard controls, focus restoration and the closed RSVP state.

Deploy the repository root from `main` using GitHub Pages. Paths are relative so the project works beneath the repository URL.

Designed by [Kenneth Gondwe Kaputula / Yellowphase](https://www.yellowphase.org). Photographs and event content remain with their respective owners.
