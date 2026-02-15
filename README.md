# Leviathan Clicker

A hot-dog-themed clicker game where you farm **mustard** and buy upgrades to increase **MPS (mustard per second)**.

## Run locally

From this folder, run one of these commands:

```bash
python3 -m http.server 8000
```

or

```bash
python -m http.server 8000
```

Then open:

- <http://127.0.0.1:8000>
- or <http://localhost:8000>

## Quick start script

You can also run:

```bash
./start-game.sh
```

## Troubleshooting: "This page can’t be reached"

- Make sure the server command is still running in the terminal.
- Make sure you started it **inside this repo folder**.
- If port `8000` is busy, try:

```bash
python3 -m http.server 8080
```

Then open <http://127.0.0.1:8080>.

- If your environment blocks localhost, open the forwarded URL your IDE provides for the running port.
