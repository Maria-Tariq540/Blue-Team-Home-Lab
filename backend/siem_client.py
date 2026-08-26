import os
import asyncio
from elasticsearch import AsyncElasticsearch
from simulation import simulation_manager

class ElasticSIEMClient:
    def __init__(self):
        self.url = os.getenv("ELASTIC_URL", "")
        self.api_key = os.getenv("ELASTIC_API_KEY", "")
        self.client = None
        self.is_connected = False

    async def connect(self):
        if not self.url:
            print("No ELASTIC_URL provided. Running in SIMULATION mode.")
            self.is_connected = False
            return

        try:
            self.client = AsyncElasticsearch(
                self.url,
                api_key=self.api_key,
                verify_certs=False
            )
            # Check connection
            info = await self.client.info()
            print(f"Connected to live Elasticsearch SIEM: {info['cluster_name']}")
            self.is_connected = True
        except Exception as e:
            print(f"Failed to connect to Elasticsearch. Falling back to simulation mode. Error: {e}")
            self.is_connected = False

    async def poll_alerts(self):
        """Mock polling of alerts from Elastic. Real implementation would query wazuh-alerts-* index."""
        if not self.is_connected:
            return
            
        # In a real environment, we would query the index here:
        # res = await self.client.search(index="wazuh-alerts-*", query={"match_all": {}})
        # But we don't want to actually poll if we are just demonstrating.
        pass

siem_client = ElasticSIEMClient()
