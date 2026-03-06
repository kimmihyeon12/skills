const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const path = require('path');

async function extractText() {
    const args = process.argv.slice(2);

    // --check 플래그 처리
    if (args.includes('--check')) {
        console.error('OK: Node.js and pdf-parse are ready.');
        process.exit(0);
    }

    const inputIdx = 0;
    const outputIdx = args.indexOf('-o') > -1 ? args.indexOf('-o') + 1 : args.indexOf('--output') > -1 ? args.indexOf('--output') + 1 : -1;

    if (args.length < 1 || args[inputIdx].startsWith('-')) {
        console.error('Usage: node scripts/extract_pdf_text.js <input.pdf> -o <output.txt>');
        process.exit(1);
    }

    if (outputIdx === -1 || outputIdx >= args.length) {
        console.error('-o/--output is required unless --check is used.');
        process.exit(1);
    }

    const inputPath = path.resolve(args[inputIdx]);
    const outputPath = path.resolve(args[outputIdx]);

    if (!fs.existsSync(inputPath)) {
        console.error(`Input PDF not found: ${inputPath}`);
        process.exit(1);
    }

    try {
        const dataBuffer = fs.readFileSync(inputPath);
        const parser = new PDFParse({ data: dataBuffer });
        const data = await parser.getText();
        await parser.destroy();

        // 출력 디렉토리가 없으면 생성
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, data.text, 'utf8');
        console.error(`Extracted ${data.total} pages using pdf-parse: ${inputPath} -> ${outputPath}`);
        process.exit(0);
    } catch (error) {
        console.error(`Error extracting PDF: ${error.message}`);
        process.exit(1);
    }
}

extractText();
