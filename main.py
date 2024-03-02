# first run installations and data download
# ! pip install -U llama-index llama-index-vector-stores-milvus pymilvus llama-index-llms-openai llama-index-readers-file
# ! mkdir -p './data/10k/'
# ! curl 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/10k/uber_2021.pdf' -O 'data/10k/uber_2021.pdf'
# ! curl 'https://raw.githubusercontent.com/run-llama/llama_index/main/docs/examples/data/10k/lyft_2021.pdf' -O 'data/10k/lyft_2021.pdf'
# ! mv 'lyft_2021.pdf' 'uber_2021.pdf' './data/10k/'

from llama_index.core import (
    SimpleDirectoryReader,
    VectorStoreIndex,
    StorageContext,
    load_index_from_storage,
)
from llama_index.core.tools import QueryEngineTool, ToolMetadata

from pymilvus import connections
from llama_index.vector_stores.milvus import MilvusVectorStore

try:
    storage_context = StorageContext.from_defaults(
        persist_dir="./storage/lyft"
    )
    lyft_index = load_index_from_storage(storage_context)

    storage_context = StorageContext.from_defaults(
        persist_dir="./storage/uber"
    )
    uber_index = load_index_from_storage(storage_context)

    index_loaded = True
except:
    index_loaded = False

if not index_loaded:
    # load data
    lyft_docs = SimpleDirectoryReader(
        input_files=["./data/10k/lyft_2021.pdf"]
    ).load_data()
    uber_docs = SimpleDirectoryReader(
        input_files=["./data/10k/uber_2021.pdf"]
    ).load_data()

    # build index
    vector_store_lyft = MilvusVectorStore(dim=1536, collection_name="lyft", overwrite=True)
    vector_store_uber = MilvusVectorStore(dim=1536, collection_name="uber", overwrite=True)
    storage_context_lyft = StorageContext.from_defaults(vector_store=vector_store_lyft)
    storage_context_uber = StorageContext.from_defaults(vector_store=vector_store_uber)
    lyft_index = VectorStoreIndex.from_documents(lyft_docs, storage_context=storage_context_lyft)
    uber_index = VectorStoreIndex.from_documents(uber_docs, storage_context=storage_context_uber)

    # persist index
    lyft_index.storage_context.persist(persist_dir="./storage/lyft")
    uber_index.storage_context.persist(persist_dir="./storage/uber")

lyft_engine = lyft_index.as_query_engine(similarity_top_k=3)
uber_engine = uber_index.as_query_engine(similarity_top_k=3)

query_engine_tools = [
    QueryEngineTool(
        query_engine=lyft_engine,
        metadata=ToolMetadata(
            name="lyft_10k",
            description=(
                "Provides information about Lyft financials for year 2021. "
                "Use a detailed plain text question as input to the tool."
            ),
        ),
    ),
    QueryEngineTool(
        query_engine=uber_engine,
        metadata=ToolMetadata(
            name="uber_10k",
            description=(
                "Provides information about Uber financials for year 2021. "
                "Use a detailed plain text question as input to the tool."
            ),
        ),
    ),
]

from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI

llm = OpenAI(model="gpt-3.5-turbo-0613")

agent = ReActAgent.from_tools(
    query_engine_tools,
    llm=llm,
    verbose=True,
    # context=context
)

response = agent.chat("What was Lyft's revenue growth in 2021?")
print(str(response))