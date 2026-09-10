/* PIVAS v1.9 integration layer specification
 * Scanner Agent: barcode -> OCR -> fuzzy matching -> confidence ranking
 * Voice Agent: speech -> text -> drug resolver -> contextual QA
 * Knowledge Version Agent: local package versions and audit trail
 */
window.PIVAS_V19 = {
  modules: ['scanner-agent','voice-agent','knowledge-version-agent'],
  recognitionPipeline: ['barcode','ocr','visual-match','confidence-score'],
  voiceModes: ['drug-search','current-drug-qa'],
  knowledge: {localFirst:true, auditTrail:true}
};
