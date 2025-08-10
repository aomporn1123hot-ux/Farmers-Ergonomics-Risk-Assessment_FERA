const form = document.getElementById("assessmentForm");
const pages = document.querySelectorAll(".page");
let currentPageIndex = 0;

function showPage(index) {
  pages.forEach((p, i) => p.classList.toggle("active", i === index));
  currentPageIndex = index;
}

function nextPage() {
  if (currentPageIndex < pages.length - 1) showPage(currentPageIndex + 1);
}

function prevPage() {
  if (currentPageIndex > 0) showPage(currentPageIndex - 1);
}

function createImageOptions(containerId, name, count, prefix) {
  const container = document.getElementById(containerId);
  for (let i = 1; i <= count; i++) {
    const label = document.createElement("label");
    label.className = "image-option";
    label.innerHTML = `
      <input type="radio" name="${name}" value="${i}">
      <img src="${prefix}${i}.png" alt="${prefix}${i}">
    `;
    container.appendChild(label);
  }
}

function nextUpperTimePage() {
  const selected = document.querySelector('input[name="upperPosture"]:checked');
  if (!selected) return alert("กรุณาเลือกท่าทางส่วนบน");
  const val = parseInt(selected.value);

  const labels = {
    1: ["1-2 นาที", "3-7 นาที", "8-18 นาที", "17 นาที"],
    2: ["1 นาที", "2-6 นาที", "7-13 นาที", "14 นาที"],
    3: ["1 นาที", "2-8 นาที", "9-12 นาที"],
    4: ["1 นาที", "2-7 นาที", "8-11 นาที"],
    5: ["1-4 นาที", "5-12 นาที"],
    6: ["1 นาที", "2-7 นาที"],
    7: ["1 นาที", "2-8 นาที"],
    8: ["1-2 นาที"],
    9: ["1-4 นาที"],
    10: ["1-3 นาที"]
  };

  const container = document.getElementById("page1");
  container.innerHTML = `<h2>ข้อ 2: เลือกระยะเวลา</h2>`;
  labels[val].forEach((text, i) => {
    container.innerHTML += `<label><input type="radio" name="upperTime" value="${i}"> ${text}</label><br>`;
  });
  container.innerHTML += `
    <div class="nav-buttons">
      <button type="button" onclick="prevPage()">ย้อนกลับ</button>
      <button type="button" onclick="showPage(2)">ถัดไป</button>
    </div>`;
  showPage(1);
}

function nextLowerTimePage() {
  const selected = document.querySelector('input[name="lowerPosture"]:checked');
  if (!selected) return alert("กรุณาเลือกท่าทางส่วนล่าง");
  const val = parseInt(selected.value);

  const labels = {
    1: ["1-10 นาที", "11-32 นาที", "33 นาที"],
    2: ["1-11 นาที", "12 นาที"],
    3: ["1 นาที"],
    4: ["1 นาที"],
    5: ["1 นาที"],
    6: ["1-8 นาที", "9 นาที"],
    7: ["1-2 นาที", "3 นาที"],
    8: ["1-3 นาที", "4 นาที"]
  };

  const container = document.getElementById("page3");
  container.innerHTML = `<h2>ข้อ 4: เลือกระยะเวลา</h2>`;
  labels[val].forEach((text, i) => {
    container.innerHTML += `<label><input type="radio" name="lowerTime" value="${i}"> ${text}</label><br>`;
  });
  container.innerHTML += `
    <div class="nav-buttons">
      <button type="button" onclick="prevPage()">ย้อนกลับ</button>
      <button type="button" onclick="showPage(4)">ถัดไป</button>
    </div>`;
  showPage(3);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const getVal = name => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? parseInt(el.value) : 0;
  };

  const upScore = 1;
  const ut = getVal("upperTime");
  const lowScore = 1;
  const lt = getVal("lowerTime");

  const f = getVal("force");
  const r = getVal("repetition");
  const t = getVal("twist");

  const upperMap = {
    1: [0, 0, 1, 2], 2: [0, 0, 1, 2], 3: [1, 2, 3], 4: [1, 2, 3],
    5: [2, 3], 6: [2, 3], 7: [2, 3], 8: [3], 9: [3], 10: [3]
  };
  const lowerMap = {
    1: [1, 2, 3], 2: [2, 3], 3: [3], 4: [3], 5: [3],
    6: [2, 3], 7: [2, 3], 8: [2, 3]
  };

  const upPosture = getVal("upperPosture");
  const lowPosture = getVal("lowerPosture");

  const utScore = (upperMap[upPosture]?.[ut]) ?? 0;
  const ltScore = (lowerMap[lowPosture]?.[lt]) ?? 0;

  const total = (upScore + utScore) * (lowScore + ltScore) + f + r + t;

  let level = "", image = "";
  if (total === 1) {
    level = "ระดับยอมรับได้ ท่าทางการปฏิบัติงานนั้นยังไม่ควรได้รับการปรับปรุง";
    image = "ยอมรับได้.jpg";
  } else if (total <= 3) {
    level = "ระดับต่ำ ท่าทางการปฏิบัติงานนั้นควรได้รับการปรับปรุงเล็กน้อย";
    image = "ต่ำ.jpg";
  } else if (total <= 7) {
    level = "ระดับปานกลาง ท่าทางการปฏิบัติงานนั้นควรได้รับการปรับปรุงเพิ่มเติม";
    image = "ปานกลาง.jpg";
  } else if (total <= 14) {
    level = "ระดับสูง ท่าทางการปฏิบัติงานนั้นควรได้รับการปรับปรุงเร่งด่วน";
    image = "สูง.jpg";
  } else {
    level = "ระดับสูงมาก ท่าทางการปฏิบัติงานนั้นควรได้รับการปรับปรุงในทันที";
    image = "สูงมาก.jpg";
  }

  document.getElementById("resultText").textContent = `คะแนนรวม: ${total} (${level})`;
  document.getElementById("resultImage").src = image;
  showPage(5);
});

window.onload = () => {
  createImageOptions("upperPostureOptions", "upperPosture", 10, "บน");
  createImageOptions("lowerPostureOptions", "lowerPosture", 8, "ล่าง");
  showPage(0);
};
