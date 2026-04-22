# app/utils/serializer.py (crie este arquivo)
def serialize_doc(doc):
    """Converte um documento do MongoDB para JSON serializável"""
    if doc is None:
        return None
    
    doc = dict(doc)
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

def serialize_docs(docs):
    """Converte uma lista de documentos do MongoDB"""
    return [serialize_doc(doc) for doc in docs]