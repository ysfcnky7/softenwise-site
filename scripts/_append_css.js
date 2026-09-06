const fs = require("fs");
const cssPath = "css/style.css";
const marker = "/* SoftenWise legal + cookie notice */";
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(marker)) {
  css += `

${marker}
.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  align-items: center;
  justify-content: center;
}
.footer-legal-inline {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.footer-legal-inline a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.footer-legal-inline a:hover {
  color: var(--accent, #2a5865);
}
.legal-prose h2 {
  margin-top: 1.6em;
  font-size: 1.15rem;
}
.legal-prose p,
.legal-prose li {
  line-height: 1.65;
  color: var(--text-muted, #4a5c66);
}
.legal-prose ul {
  padding-left: 1.2em;
}
.cookie-notice {
  position: fixed;
  z-index: 90;
  left: 16px;
  right: 16px;
  bottom: 16px;
  max-width: 520px;
  margin-inline: auto;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(14, 58, 70, 0.14);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 40px rgba(14, 58, 70, 0.16);
  display: none;
  gap: 12px;
  align-items: flex-start;
}
.cookie-notice.is-visible {
  display: flex;
}
.cookie-notice p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #2a3d46;
  flex: 1;
}
.cookie-notice a {
  color: #0e3a46;
  text-decoration: underline;
}
.cookie-notice__actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.cookie-notice__btn {
  border: 0;
  border-radius: 999px;
  padding: 8px 14px;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background: #0e3a46;
  color: #fff;
}
@media (max-width: 560px) {
  .cookie-notice {
    flex-direction: column;
    bottom: 72px;
  }
}
.human-check {
  margin: 12px 0 4px;
}
.human-check.is-invalid .human-check-input {
  border-color: #b42318;
}
.human-check-label {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
}
.human-check-input {
  width: 5.5rem;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(14, 58, 70, 0.2);
}
`;
  fs.writeFileSync(cssPath, css.replace(/\r\n/g, "\n"), "utf8");
  console.log("css appended");
} else console.log("css already has marker");
