import { useState } from 'react';
import { Document, Page } from 'react-pdf';

export default function PDFPreview({ path }: { path: string }) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const file = path;

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    return (
        <div className="flex flex-col items-center">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
            </Document>

            <div className="mt-4 flex gap-2">
                <button onClick={() => setPageNumber((p) => Math.max(p - 1, 1))} disabled={pageNumber <= 1} className="rounded bg-gray-300 px-4 py-2">
                    Prev
                </button>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <button
                    onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
                    disabled={pageNumber >= numPages}
                    className="rounded bg-gray-300 px-4 py-2"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
