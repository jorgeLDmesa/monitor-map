import { NextResponse } from 'next/server';

const SHEET_ID = '19XjzCgUWcaYPsBY0zsP0Jdd1W-vDQO01gwWC0XlsHn0';
const SHEET_GID = '0';

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export async function GET() {
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

    const response = await fetch(csvUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Google Sheets data');
    }

    const csvText = await response.text();
    const lines = csvText.split('\n');

    const reports = lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = parseCSVLine(line);

        return {
          id: `report-${index + 1}`,
          date: values[2] || '',
          location: values[0] || '',
          description: values[1] || '',
        };
      });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports', reports: [] }, { status: 500 });
  }
}
