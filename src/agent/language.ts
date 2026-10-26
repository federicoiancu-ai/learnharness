import type { Message, TranscriptContext } from "@earendil-works/pi-ai";

/**
 * Learner language (fork `italiano`): one instruction appended to the leading
 * system message of EVERY model request — teacher, prober, practice, the
 * sub-agents and the graph extraction — at the single engine seam in
 * models.ts. Kept in its own file so upstream merges touch one import line.
 *
 * `LH_LANGUAGE` picks the language (default Italian); `off` disables it.
 * The text is constant, so the cached prompt prefix stays stable.
 */
const LANGUAGE = (process.env.LH_LANGUAGE ?? "Italian").trim();

function instruction(language: string): string {
	return [
		"## Language",
		"",
		`The learner speaks and reads ${language}. Everything the learner reads is written in ${language}: prose, questions and answer options, explanations, hints, plan node labels, problem statements, model solutions and rubrics, research reports, diagram and demo labels, and the names and statements of graph propositions and reasoning chains.`,
		`The learner writes and dictates in ${language}; his thinking fields may mix in English terms.`,
		"Keep unchanged: code, identifiers, file paths, formulas, tool names and tool-input field names, and established technical terms that have no common translation (on first use you may give the English term in parentheses).",
		`Sources in other languages are read as they are and reported in ${language}.`,
	].join("\n");
}

const TEXT = LANGUAGE && LANGUAGE.toLowerCase() !== "off" ? instruction(LANGUAGE) : null;

function append(message: Message, text: string): Message {
	if (message.role !== "system") return message;
	const content = typeof message.content === "string"
		? `${message.content}\n\n---\n\n${text}`
		: [...message.content, { type: "text" as const, text: `\n\n---\n\n${text}` }];
	return { ...message, content };
}

/** The context with the language instruction on its leading system message
 *  (or a new leading system message when the request has none). */
export function withLearnerLanguage(context: TranscriptContext): TranscriptContext {
	if (!TEXT) return context;
	const [first, ...rest] = context.messages;
	const messages: Message[] = first?.role === "system"
		? [append(first, TEXT), ...rest]
		: [{ role: "system", content: TEXT } as Message, ...context.messages];
	return { ...context, messages } as TranscriptContext;
}
