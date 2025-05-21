const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function mergePdfWithTemplate(templatePath, contentPath, outputPath) {
  const templateBytes = fs.readFileSync(templatePath);
  const contentBytes = fs.readFileSync(contentPath);

  const templatePdf = await PDFDocument.load(templateBytes);
  const contentPdf = await PDFDocument.load(contentBytes);

  const mergedPdf = await PDFDocument.create();

  // 템플릿과 콘텐츠 페이지 가져오기
  const [templatePage] = await mergedPdf.copyPages(templatePdf, [0]);
  const [contentPage] = await contentPdf.getPages();  // ❗ 여기 주의

  // 템플릿 페이지를 새 문서에 추가
  const newPage = mergedPdf.addPage(templatePage);

  // 콘텐츠 페이지를 임베드하고 그리기
  const embeddedContentPage = await mergedPdf.embedPage(contentPage);
  newPage.drawPage(embeddedContentPage);  // ✅ 반드시 embedPage() 먼저

  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, mergedBytes);
}

module.exports = {
  mergePdfWithTemplate
};