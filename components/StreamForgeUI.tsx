"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuid } from "uuid";

type TabId = "today" | "tasks" | "comics" | "social";

export default function StreamforgeUI({ initialTasks, user }) {
  const supabase = createClient();

  const [tab, setTab] = useState<TabId>("tasks");
  const [tasks, setTasks] = useState(initialTasks);
  const [offset, setOffset] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [draftTask, setDraftTask] = useState({});
  const [log, setLog] = useState([]);

  // --- Log helper ---
  const logMsg = (message) => {
    setLog((prev) => [
      ...prev,
      {
        id: uuid(),
        ts: new Date().toLocaleTimeString(),
        message,
      },
    ]);
  };

  // --- Infinite scroll load ---
  async function loadMore(reset = false) {
    if (loading) return;
    setLoading(true);

    const limit = 20;
    const currentOffset = reset ? 0 : offset;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(currentOffset, currentOffset + limit - 1);

    if (error) {
      console.error(error);
      logMsg("Failed to load tasks.");
      setLoading(false);
      return;
    }

    if (reset) setTasks(data);
    else setTasks((prev) => [...prev, ...data]);

    setOffset(currentOffset + data.length);
    setHasMore(data.length === limit);

    logMsg(`Loaded ${data.length} task(s).`);
    setLoading(false);
  }

  // Modal helpers
  function openModal() {
    setDraftTask({});
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  // Task save
  async function handleSave(e) {
    e.preventDefault();

    if (!draftTask.title) {
      alert("Task title is required.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        ...draftTask,
      })
      .select()
      .single();

    if (error) {
      logMsg("Save error: " + error.message);
    } else {
      logMsg("Task saved: " + data.title);
      setTasks((prev) => [data, ...prev]);
    }

    setLoading(false);
    setShowModal(false);
  }

  // Render task card
  function renderTaskCard(t) {
    const tags =
      t.tags?.split(/[,; ]+/).map((s) => s.trim()).filter(Boolean) ?? [];

    return (
      <div key={t.id} className="sf-post">
        <div className="sf-title">{t.title}</div>
        <div className="sf-body">
          Week {t.week ?? "-"} | Day {t.day ?? "-"} | {t.hour}:{t.minute}
          <br />
          Priority: {t.priority ?? "-"} | Reward: {t.reward ?? "-"}
          <br />
          Focus: {t.focus ?? "-"} | Stage: {t.stage ?? "-"}
          <br />
          Status: {t.status ?? "-"}
        </div>
        <div>
          {tags.map((tag) => (
            <span key={tag} className="sf-tag">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Render tabs
  function renderTab() {
    switch (tab) {
      case "today":
        return (
          <div className="sf-content">
            <div className="sf-post">
              <div className="sf-title">Today</div>
              <div className="sf-body sf-muted">
                This will show your daily generated summary.
              </div>
            </div>
          </div>
        );

      case "tasks":
        return (
          <div className="sf-content">
            <div className="sf-row-right" style={{ marginBottom: 8 }}>
              <button className="sf-btn sf-btn-primary" onClick={openModal}>
                + New Task
              </button>
              <button
                className="sf-btn sf-btn-ghost"
                onClick={() => loadMore(true)}
              >
                Refresh
              </button>
            </div>

            {tasks.map(renderTaskCard)}

            <div style={{ marginTop: 12, textAlign: "center" }}>
              {hasMore ? (
                <button
                  className="sf-btn sf-btn-primary"
                  disabled={loading}
                  onClick={() => loadMore(false)}
                >
                  {loading ? "Loading…" : "Load more"}
                </button>
              ) : (
                <span className="sf-muted">End of list</span>
              )}
            </div>
          </div>
        );

      case "comics":
        return (
          <div className="sf-content">
            <div className="sf-post">
              <div className="sf-title">ComicForge</div>
              <div className="sf-body sf-muted">
                Placeholder. Full ComicForge coming.
              </div>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="sf-content">
            <div className="sf-post">
              <div className="sf-title">Social</div>
              <div className="sf-body sf-muted">
                Placeholder for decentralized feed.
              </div>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="sf-root">
      <div className="sf-tabs">
        {["today", "tasks", "comics", "social"].map((t) => (
          <div
            key={t}
            className={`sf-tab ${tab === t ? "sf-tab-active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </div>
        ))}
      </div>

      {renderTab()}

      {/* Modal */}
      {showModal && (
        <div className="sf-modal-backdrop">
          <div className="sf-modal">
            <h3>New Task</h3>
            <form onSubmit={handleSave}>
              <label className="sf-label">Title</label>
              <input
                className="sf-input"
                value={draftTask.title || ""}
                onChange={(e) =>
                  setDraftTask({ ...draftTask, title: e.target.value })
                }
              />

              <label className="sf-label">Tags</label>
              <input
                className="sf-input"
                value={draftTask.tags || ""}
                onChange={(e) =>
                  setDraftTask({ ...draftTask, tags: e.target.value })
                }
              />

              <div className="sf-row-right" style={{ marginTop: 10 }}>
                <button
                  type="button"
                  className="sf-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="sf-btn sf-btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log console */}
      <div className="sf-log">
        {log.map((l) => (
          <div key={l.id}>
            [{l.ts}] {l.message}
          </div>
        ))}
      </div>
    </div>
  );
}
