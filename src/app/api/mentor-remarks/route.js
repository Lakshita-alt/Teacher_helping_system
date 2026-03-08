import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const REMARKS_PATH = path.join(process.cwd(), "database", "mentor-remarks.json");

function readRemarks() {
  if (!fs.existsSync(REMARKS_PATH)) return {};
  return JSON.parse(fs.readFileSync(REMARKS_PATH, "utf-8"));
}

function writeRemarks(data) {
  fs.writeFileSync(REMARKS_PATH, JSON.stringify(data, null, 2));
}

// GET /api/mentor-remarks?studentId=S001
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "studentId required" }, { status: 400 });
    }

    const all = readRemarks();
    return NextResponse.json({ remarks: all[studentId] || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read remarks" }, { status: 500 });
  }
}

// POST /api/mentor-remarks  body: { studentId, text }
export async function POST(request) {
  try {
    const { studentId, text } = await request.json();

    if (!studentId || !text?.trim()) {
      return NextResponse.json({ error: "studentId and text required" }, { status: 400 });
    }

    const all = readRemarks();
    if (!all[studentId]) all[studentId] = [];

    const remark = {
      id: `r_${Date.now()}`,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    all[studentId].push(remark);
    writeRemarks(all);

    return NextResponse.json({ remark });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save remark" }, { status: 500 });
  }
}

// DELETE /api/mentor-remarks  body: { studentId, remarkId }
export async function DELETE(request) {
  try {
    const { studentId, remarkId } = await request.json();

    const all = readRemarks();
    if (all[studentId]) {
      all[studentId] = all[studentId].filter((r) => r.id !== remarkId);
      writeRemarks(all);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete remark" }, { status: 500 });
  }
}
