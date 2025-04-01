const readFileAsBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
}

const getFileSizeFromBase64 = (base64) => {
  const length = base64.length;
  const padding = (base64.match(/=+$/) || [""])[0].length;
  const sizeInBytes = (length * 3) / 4 - padding;
  return sizeInBytes;
}

const downloadBase64 = (base64, fileName) => {
  const byteCharacters = atob(base64); // Giải mã Base64 thành chuỗi nhị phân
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/octet-stream" });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Giải phóng bộ nhớ
}

export default {
  readFileAsBase64,
  getFileSizeFromBase64,
  downloadBase64
}