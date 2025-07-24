import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function App() {
  const [pages, setPages] = useState([]);
  const [collapsedPages, setCollapsedPages] = useState([]);
  const [collapsedFields, setCollapsedFields] = useState({});

  const toggleCollapse = (pageIdx) => {
    setCollapsedPages((prev) =>
      prev.includes(pageIdx)
        ? prev.filter((idx) => idx !== pageIdx)
        : [...prev, pageIdx]
    );
  };

  const toggleFieldCollapse = (pageIdx, fieldIdx) => {
    const key = `${pageIdx}-${fieldIdx}`;
    setCollapsedFields((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addPage = () => {
    const newPage = {
      pageIndex: pages.length + 1,
      title: `Page ${pages.length + 1}`,
      fields: []
    };
    setPages([...pages, newPage]);
  };

  const deletePage = (pageIdx) => {
    const updatedPages = pages.filter((_, idx) => idx !== pageIdx);
    setPages(updatedPages);
  };

  const addField = (pageIdx) => {
    const newField = {
      label: '',
      name: '',
      type: 'text',
      required: false,
      validation: {},
      options: [''],
      accept: ['']
    };
    const updatedPages = [...pages];
    updatedPages[pageIdx].fields.push(newField);
    setPages(updatedPages);
  };

  const deleteField = (pageIdx, fieldIdx) => {
    const updatedPages = [...pages];
    updatedPages[pageIdx].fields.splice(fieldIdx, 1);
    setPages(updatedPages);
  };

  const updateField = (pageIdx, fieldIdx, key, value) => {
    const updatedPages = [...pages];
    updatedPages[pageIdx].fields[fieldIdx][key] = value;

    if (key === 'type') {
      const field = updatedPages[pageIdx].fields[fieldIdx];
      field.options = [''];
      field.accept = [''];
      field.validation = {};
    }

    setPages(updatedPages);
  };

  const updateValidation = (pageIdx, fieldIdx, key, value) => {
    const updatedPages = [...pages];
    if (!updatedPages[pageIdx].fields[fieldIdx].validation) {
      updatedPages[pageIdx].fields[fieldIdx].validation = {};
    }
    updatedPages[pageIdx].fields[fieldIdx].validation[key] = value;
    setPages(updatedPages);
  };

  const updateArrayField = (pageIdx, fieldIdx, key, index, value) => {
    const updatedPages = [...pages];
    updatedPages[pageIdx].fields[fieldIdx][key][index] = value;
    setPages(updatedPages);
  };

  const addArrayFieldItem = (pageIdx, fieldIdx, key) => {
    const updatedPages = [...pages];
    updatedPages[pageIdx].fields[fieldIdx][key].push('');
    setPages(updatedPages);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'page') {
      const reorderedPages = Array.from(pages);
      const [movedPage] = reorderedPages.splice(source.index, 1);
      reorderedPages.splice(destination.index, 0, movedPage);
      setPages(reorderedPages);
    } else if (type === 'field') {
      const pageIdx = parseInt(source.droppableId);
      const updatedPages = [...pages];
      const page = updatedPages[pageIdx];
      const fields = Array.from(page.fields);
      const [movedField] = fields.splice(source.index, 1);
      fields.splice(destination.index, 0, movedField);
      updatedPages[pageIdx].fields = fields;
      setPages(updatedPages);
    }
  };
const downloadJson = () => {
  const jsonString = JSON.stringify({ pages }, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'form-template.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  return (
    <div className="container py-4">
      <header className="bg-success text-white text-center p-3 mb-4 rounded">
        <h3>Customer Onboarding Journey Template Builder</h3>
      </header>

      <button className="btn btn-primary mb-3" onClick={addPage}>➕ Add Page</button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-pages" type="page">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {pages.map((page, pageIdx) => (
                <Draggable draggableId={`page-${pageIdx}`} index={pageIdx} key={`page-${pageIdx}`}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="card mb-3">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <div>
                          <span {...provided.dragHandleProps} className="me-2 cursor-move">☰</span>
                          <button className="btn btn-sm btn-secondary me-2" onClick={() => toggleCollapse(pageIdx)}>
                            {collapsedPages.includes(pageIdx) ? '➕' : '➖'}
                          </button>
                          <strong>{page.title}</strong>
                        </div>
                        <button className="btn btn-sm btn-danger" onClick={() => deletePage(pageIdx)}>🗑 Delete Page</button>
                      </div>

                      {!collapsedPages.includes(pageIdx) && (
                        <div className="card-body">
                          <input
                            className="form-control mb-2"
                            placeholder="Title"
                            value={page.title}
                            onChange={(e) => {
                              const updatedPages = [...pages];
                              updatedPages[pageIdx].title = e.target.value;
                              setPages(updatedPages);
                            }}
                          />
                          <button className="btn btn-outline-primary mb-3" onClick={() => addField(pageIdx)}>➕ Add Field</button>

                          <Droppable droppableId={`${pageIdx}`} type="field">
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.droppableProps}>
                                {page.fields.map((field, fieldIdx) => {
                                  const fieldKey = `${pageIdx}-${fieldIdx}`;
                                  return (
                                    <Draggable draggableId={`field-${pageIdx}-${fieldIdx}`} index={fieldIdx} key={`field-${pageIdx}-${fieldIdx}`}>
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className="border rounded p-3 mb-3 bg-light"
                                        >
                                          <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                              <span {...provided.dragHandleProps} className="me-2 cursor-move">☰</span>
                                              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => toggleFieldCollapse(pageIdx, fieldIdx)}>
                                                {collapsedFields[fieldKey] ? '➕' : '➖'}
                                              </button>
                                              <strong>Field {fieldIdx + 1}</strong>
                                            </div>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteField(pageIdx, fieldIdx)}>🗑 Remove</button>
                                          </div>

                                          {!collapsedFields[fieldKey] && (
                                            <>
                                              <input
                                                className="form-control my-1"
                                                placeholder="Label"
                                                value={field.label}
                                                onChange={(e) => updateField(pageIdx, fieldIdx, 'label', e.target.value)}
                                              />
                                              <input
                                                className="form-control my-1"
                                                placeholder="Name"
                                                value={field.name}
                                                onChange={(e) => updateField(pageIdx, fieldIdx, 'name', e.target.value)}
                                              />
                                              <select
                                                className="form-select my-1"
                                                value={field.type}
                                                onChange={(e) => updateField(pageIdx, fieldIdx, 'type', e.target.value)}
                                              >
                                                <option value="text">Text</option>
                                                <option value="number">Number</option>
                                                <option value="select">Select</option>
                                                <option value="radio">Radio</option>
                                                <option value="file">File</option>
                                              </select>

                                              <div className="form-check my-1">
                                                <input
                                                  type="checkbox"
                                                  className="form-check-input"
                                                  checked={field.required}
                                                  onChange={(e) => updateField(pageIdx, fieldIdx, 'required', e.target.checked)}
                                                />
                                                <label className="form-check-label">Required</label>
                                              </div>

                                              {field.type === 'number' && (
                                                <>
                                                  <input className="form-control my-1" placeholder="Min" type="number" onChange={(e) => updateValidation(pageIdx, fieldIdx, 'min', parseInt(e.target.value))} />
                                                  <input className="form-control my-1" placeholder="Max" type="number" onChange={(e) => updateValidation(pageIdx, fieldIdx, 'max', parseInt(e.target.value))} />
                                                </>
                                              )}

                                              {field.type === 'text' && (
                                                <input className="form-control my-1" placeholder="Regex" onChange={(e) => updateValidation(pageIdx, fieldIdx, 'regex', e.target.value)} />
                                              )}

                                              {(field.type === 'select' || field.type === 'radio') && (
                                                <>
                                                  {field.options.map((opt, idx) => (
                                                    <input
                                                      key={idx}
                                                      className="form-control my-1"
                                                      placeholder={`Option ${idx + 1}`}
                                                      value={opt}
                                                      onChange={(e) => updateArrayField(pageIdx, fieldIdx, 'options', idx, e.target.value)}
                                                    />
                                                  ))}
                                                  <button className="btn btn-sm btn-outline-primary" onClick={() => addArrayFieldItem(pageIdx, fieldIdx, 'options')}>+ Option</button>
                                                </>
                                              )}

                                              {field.type === 'file' && (
                                                <>
                                                  {field.accept.map((ext, idx) => (
                                                    <input
                                                      key={idx}
                                                      className="form-control my-1"
                                                      placeholder="File Type (.pdf, .jpg)"
                                                      value={ext}
                                                      onChange={(e) => updateArrayField(pageIdx, fieldIdx, 'accept', idx, e.target.value)}
                                                    />
                                                  ))}
                                                  <button className="btn btn-sm btn-outline-primary" onClick={() => addArrayFieldItem(pageIdx, fieldIdx, 'accept')}>+ File Type</button>
                                                </>
                                              )}
                                            </>
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="text-end mb-2">
        <button className="btn btn-success" onClick={downloadJson}>
          ⬇️ Download JSON
        </button>
      </div>

      <h3 className="mt-4">📦 Generated JSON</h3>
      <pre className="bg-light p-3 border rounded">
        {JSON.stringify({ pages }, null, 2)}
      </pre>

      <footer className="text-center text-muted mt-5 border-top pt-3">
        <small>&copy; 2025 Lloyds Banking Group – All rights reserved.</small>
      </footer>
    </div>
  );
}

export default App;
