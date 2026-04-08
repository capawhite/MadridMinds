# Madrid Minds

Static landing page for Madrid Minds (served as-is on [Render](https://render.com) per `render.yaml`).

## Image retouching

Hero and split photos can be regenerated with Pillow:

```bash
pip3 install --user Pillow
python3 scripts/retouch_images.py
```

This updates `abya-privados-05.jpg`, `chess.png`, and `wine.png` in place using the same parameters committed in the script.
