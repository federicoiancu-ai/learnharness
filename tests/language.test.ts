import { test } from "node:test";
import assert from "node:assert/strict";
import type { Message, TranscriptContext } from "@earendil-works/pi-ai";
import { withLearnerLanguage } from "../src/agent/language.ts";

const ctx = (messages: Message[]) => ({ messages }) as unknown as TranscriptContext;
const user = { role: "user", content: "ciao", timestamp: 0 } as Message;

test("appends the Italian instruction to a string system prompt", () => {
	const out = withLearnerLanguage(ctx([{ role: "system", content: "BASE" } as Message, user]));
	const system = out.messages[0] as { role: string; content: string };
	assert.equal(system.role, "system");
	assert.ok(system.content.startsWith("BASE\n\n---\n\n## Language"));
	assert.match(system.content, /reads Italian/);
	assert.equal(out.messages[1], user);
	assert.equal(out.messages.length, 2);
});

test("appends a text part to a structured system prompt", () => {
	const out = withLearnerLanguage(ctx([{ role: "system", content: [{ type: "text", text: "BASE" }] } as Message, user]));
	const content = (out.messages[0] as { content: Array<{ type: string; text: string }> }).content;
	assert.equal(content.length, 2);
	assert.equal(content[0]?.text, "BASE");
	assert.match(content[1]?.text ?? "", /## Language/);
});

test("adds a leading system message when the request has none", () => {
	const out = withLearnerLanguage(ctx([user]));
	assert.equal(out.messages.length, 2);
	assert.equal(out.messages[0]?.role, "system");
	assert.equal(out.messages[1], user);
});

test("is deterministic, so the cached prefix stays stable", () => {
	const a = withLearnerLanguage(ctx([{ role: "system", content: "BASE" } as Message, user]));
	const b = withLearnerLanguage(ctx([{ role: "system", content: "BASE" } as Message, user]));
	assert.deepEqual(a.messages[0], b.messages[0]);
});
