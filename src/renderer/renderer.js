const $ = (id) => document.getElementById(id);
const state = { workbook: null, connected: false, sharing: false };
const connectButton = $('connect');
const disconnectButton = $('disconnect');
const statusNode = $('status');

function setStatus(message, error = false) {
  statusNode.textContent = message;
  statusNode.classList.toggle('error', error);
}

function refreshAction() {
  $('update').disabled = !(state.sharing && state.workbook && $('model').value);
}

function setSession(session) {
  state.connected = Boolean(session?.connected);
  state.sharing = Boolean(session?.sharing);
  $('auth-status').textContent = state.sharing ? 'อนุญาตใช้แผน ChatGPT แล้ว' : state.connected ? 'เชื่อมแล้ว · ยังไม่ได้อนุญาตใช้งาน' : 'ยังไม่เชื่อมบัญชี';
  $('auth-status').classList.toggle('connected', state.sharing);
  connectButton.hidden = state.sharing;
  disconnectButton.hidden = !state.connected;
  refreshAction();
}

async function loadModels() {
  const select = $('model');
  try {
    const models = await window.finApp.getModels();
    select.replaceChildren(...models.map((model) => {
      const option = document.createElement('option');
      option.value = model.slug; option.textContent = model.label;
      return option;
    }));
    select.disabled = models.length === 0;
    refreshAction();
  } catch (error) {
    select.replaceChildren(new Option('ยังโหลดโมเดลไม่ได้', ''));
    setStatus(error.message, true);
  }
}

connectButton.addEventListener('click', async () => {
  connectButton.disabled = true;
  setStatus('กำลังเปิดหน้าลงชื่อเข้าใช้และขออนุญาตใช้แผน ChatGPT…');
  try {
    const session = await window.finApp.signIn();
    setSession(session);
    await loadModels();
    setStatus('เชื่อมต่อแล้ว เลือก workbook และกดประมวลผลได้');
  } catch (error) { setStatus(error.message || 'เชื่อมต่อไม่สำเร็จ', true); }
  finally { connectButton.disabled = false; }
});

disconnectButton.addEventListener('click', async () => {
  try { setSession(await window.finApp.signOut()); $('model').replaceChildren(new Option('เชื่อมต่อบัญชีก่อน', '')); $('model').disabled = true; }
  catch (error) { setStatus(error.message, true); }
});

$('workbook').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  state.workbook = null;
  if (!file) { $('file-name').textContent = 'ยังไม่ได้เลือกไฟล์'; refreshAction(); return; }
  try {
    if (file.size > 20 * 1024 * 1024) throw new Error('ขนาดไฟล์เกิน 20 MB');
    state.workbook = { name: file.name, bytes: await file.arrayBuffer() };
    $('file-name').textContent = `${file.name} · ${Math.ceil(file.size / 1024)} KB`;
  } catch (error) { $('file-name').textContent = error.message; }
  refreshAction();
});

$('model').addEventListener('change', refreshAction);
$('update').addEventListener('click', async () => {
  $('update').disabled = true;
  setStatus('กำลังอ่านชีต Financial Highlights และประมวลผล…');
  $('html-output').value = ''; $('js-output').value = '';
  document.querySelectorAll('[data-copy],[data-download]').forEach((button) => { button.disabled = true; });
  try {
    const result = await window.finApp.update({
      html: $('html-code').value,
      javascript: $('javascript-code').value,
      workbook: state.workbook.bytes,
      workbookName: state.workbook.name,
      language: $('locale').value,
      model: $('model').value
    });
    $('html-output').value = result.html;
    $('js-output').value = result.javascript;
    $('notes').replaceChildren(...result.notes.map((note) => { const li = document.createElement('li'); li.textContent = note; return li; }));
    $('notes-box').hidden = !result.notes.length;
    document.querySelectorAll('[data-copy],[data-download]').forEach((button) => { button.disabled = false; });
    setStatus('อัปเดตเสร็จแล้ว ตรวจทานโค้ดและหมายเหตุก่อนนำไปใช้');
  } catch (error) { setStatus(error.message || 'ประมวลผลไม่สำเร็จ', true); }
  finally { refreshAction(); }
});

document.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
  await navigator.clipboard.writeText($(button.dataset.copy).value);
  setStatus('คัดลอกโค้ดแล้ว');
}));
document.querySelectorAll('[data-download]').forEach((button) => button.addEventListener('click', () => {
  const blob = new Blob([$(button.dataset.download).value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = button.dataset.name; link.click();
  URL.revokeObjectURL(url);
}));
$('clear').addEventListener('click', () => {
  $('locale').value = 'ไทย'; $('workbook').value = ''; $('file-name').textContent = 'ยังไม่ได้เลือกไฟล์';
  $('html-code').value = ''; $('javascript-code').value = ''; $('html-output').value = ''; $('js-output').value = '';
  $('notes-box').hidden = true; state.workbook = null; setStatus('');
  document.querySelectorAll('[data-copy],[data-download]').forEach((button) => { button.disabled = true; });
  refreshAction();
});

window.finApp.getSession().then(async (session) => {
  setSession(session);
  if (session?.sharing) await loadModels();
});
