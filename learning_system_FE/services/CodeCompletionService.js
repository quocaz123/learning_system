function cleanCompletion(completion) {
  // Loại bỏ markdown
  let code = completion
    .replace(/```python\n?/g, "")
    .replace(/```/g, "")
    .trim();

  // Loại bỏ docstring đầu hàm (""" ... """)
  code = code.replace(/"""[\s\S]*?"""/g, "");

  // Loại bỏ dòng trống thừa
  code = code.replace(/^\s*\n/gm, "");

  return code.trim();
}

export const fetchCodeCompletion = async (code) => {
  const res = await fetch("http://127.0.0.1:5000/lmstudio/completion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  // Xử lý completion trước khi trả về
  return cleanCompletion(data.completion);
}; 