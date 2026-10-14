import { useState } from "react";
import { addPortfolioItem } from "../../api/portfolio";

// Ana sayfadaki galeri filtreleriyle aynı yazım (filtre buna göre arıyor)
const STYLE_OPTIONS = [
  "Fine line",
  "Blackwork",
  "Traditional",
  "Realism",
  "Dotwork",
  "Lettering",
];

const emptyForm = { imageUrl: "", title: "", style: "" };

// Galeriye yeni bir çalışma ekleme formu.
//   onAdded → görsel eklenince yeni görselle çağrılır
const AddWorkForm = ({ onAdded }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const imageUrl = form.imageUrl.trim();

  const handleChange = (event) => {
    setAdded(false);
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setAdded(false);
    setSubmitting(true);

    // Başlık ve stil boşsa hiç gönderilmez
    const payload = { imageUrl };
    if (form.title.trim()) payload.title = form.title.trim();
    if (form.style) payload.style = form.style;

    try {
      const item = await addPortfolioItem(payload);
      onAdded(item);
      setForm(emptyForm);
      setAdded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2 className="block-title disp">Add new work</h2>

      <div className="add-layout">
        {/* Önizleme */}
        <div className="preview">
          {imageUrl ? (
            <img
              key={imageUrl}
              src={imageUrl}
              alt="Preview of the new work"
              onError={(event) => {
                event.currentTarget.style.visibility = "hidden";
              }}
            />
          ) : (
            <span className="preview-empty label">Preview</span>
          )}
        </div>

        {/* Alanlar */}
        <div className="add-fields">
          <div className="field">
            <label htmlFor="imageUrl" className="field-label">
              Image address (URL)
            </label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              className="field-input"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="title" className="field-label">
              Title (optional)
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="field-input"
              placeholder="Give the piece a name"
              maxLength={100}
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label htmlFor="style" className="field-label">
              Style (optional)
            </label>
            <select
              id="style"
              name="style"
              className="field-input"
              value={form.style}
              onChange={handleChange}
            >
              <option value="">No style</option>
              {STYLE_OPTIONS.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {added && (
        <p className="saved" role="status">
          Work added. It is now on your public page.
        </p>
      )}

      <div className="add-buttons">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add to portfolio"}
        </button>
      </div>
    </form>
  );
};

export default AddWorkForm;