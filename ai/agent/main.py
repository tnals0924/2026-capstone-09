import asyncio
import os
from client import MCPClient
from agent import Agent
import sys


async def main():
    token = os.environ["FLOWMEET_JWT"]
    mcp_client = MCPClient()

    try:
        await mcp_client.connect("http://localhost:8082/mcp", token)
 
        agent = Agent(mcp_client=mcp_client)
 
        while True:
            raw = await asyncio.get_running_loop().run_in_executor(None, sys.stdin.buffer.readline)
            user_input = raw.decode("utf-8", errors="replace").strip()

            if user_input.lower() in ("exit", "quit"):
                break
            if not user_input:
                continue
 
            response = await agent.run(user_input)
            print(f"Agent: {response}\n")
 
    finally:
        await mcp_client.close()
 
 
if __name__ == "__main__":
    asyncio.run(main())