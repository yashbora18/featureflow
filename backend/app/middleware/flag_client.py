import threading
import time
import requests


class FeatureFlagClient:
    """
    Lightweight Feature Flag Middleware Client

    Features:
    - Stores feature flags in local memory
    - Refreshes flags automatically
    - Returns cached values instantly
    """

    def __init__(self, api_url: str, refresh_interval: int = 30):
        """
        api_url: Feature Flag Backend URL
        refresh_interval: Time (seconds) between cache refreshes
        """

        self.api_url = api_url.rstrip("/")
        self.refresh_interval = refresh_interval

        # Local cache
        self.cache = {}

        # Thread control
        self.running = False
        self.thread = None

    def start(self):
        """
        Start automatic background refresh.
        """

        if self.running:
            print("Feature Flag Client already running.")
            return

        self.running = True

        self.thread = threading.Thread(
            target=self.refresh_flags,
            daemon=True
        )

        self.thread.start()

        print("Feature Flag Client started.")

    def stop(self):
        """
        Stop background refresh.
        """

        self.running = False

        if self.thread:
            self.thread.join(timeout=1)

        print("Feature Flag Client stopped.")

    def refresh_flags(self):
        """
        Fetch latest flags from API periodically.
        """

        while self.running:
            try:

                response = requests.get(
                    f"{self.api_url}/flags",
                    timeout=5
                )

                if response.status_code == 200:

                    flags = response.json()

                    updated_cache = {}

                    for flag in flags:

                        key = flag.get("flag_key") or flag.get("key")

                        value = flag.get("enabled")

                        updated_cache[key] = value

                    self.cache = updated_cache

                    print("Cache refreshed.")

                else:
                    print("Unable to fetch flags.")

            except Exception as e:
                print("Refresh Error:", e)

            time.sleep(self.refresh_interval)

    def is_enabled(self, flag_key: str) -> bool:
        """
        Return cached flag state.
        """

        return self.cache.get(flag_key, False)

    def get_all_flags(self):
        """
        Return all cached flags.
        """

        return self.cache