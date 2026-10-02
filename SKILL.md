---
name: typesafe-ai
license: MIT
description: >
  Build AI-powered software with TypeSafe: small units of AI intelligence you
  can use like programming primitives. Its System One models, including Jev,
  turn natural language and application state into typed judgments and
  probabilities that code can combine. Applications include routing, ranking,
  extraction, verification, and interactive experiences; these are starting
  points, not the limits.

  Use this skill whenever the task involves TypeSafe, Jev or System One, and
  also when a feature needs programmable common sense: routing or classifying
  a message, ticket or request to the right handler; scoring or ranking items
  along a described dimension; judging intent, urgency, sentiment or
  complexity; extracting typed values from free text; replacing an LLM
  prompt-and-parse step with a structured judgment; gating an action on
  confidence; escalating uncertain cases to a person.

  中文场景同样适用 —— 凡是要「让 AI 做判断」而不是生成文本的任务：给消息、工单或请求
  分类或路由，按某个维度打分或排序，判断意图、紧急度、情绪、复杂度，从自由文本里抽取值，
  把「调大模型再解析回复」改成结构化判断，用置信度决定能否自动处理、拿不准转人工 ——
  都应先调用本技能，读实时文档再动手。
---

# Build with TypeSafe

TypeSafe makes units of AI intelligence usable like programming primitives: small
judgments you can compose into larger capabilities. Its **System One models** return
fast, focused judgments that software can consume directly. **Jev** is TypeSafe's
flagship and first System One model. It understands natural language and returns
typed answers and probabilities rather
than generating text or reasoning explanations. Code owns the workflow; the model
supplies programmable common sense where ordinary code needs semantic understanding.

## Read the live docs

**The live TypeSafe docs are the source of truth. Read them as part of the task.**
This skill gives direction; the docs carry current concepts, prompting guidance,
API contracts, SDK usage, models, limits, and worked examples.

- Start with the [documentation index](https://docs.typesafe.ai/llms.txt) to discover
  relevant pages and cookbooks. Use targeted reads rather than loading the entire site.
- Mintlify serves Markdown by appending `.md` to a page path, for example
  [how to build with TypeSafe](https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md).
  Follow links from the index; convert extensionless documentation page links to
  `.md` when useful. Resolve relative links against `https://docs.typesafe.ai`.
- Before writing an integration, read the current API or chosen SDK page and the
  question guidance relevant to the design. For a new workflow, also inspect the
  closest cookbook: it often shows a better decomposition than a generic classifier.
- If the index is unavailable, use the direct links below or the site's navigation.
  If Markdown fetching fails, try the normal page. If live access is unavailable,
  use available local docs or installed SDK types, state that limitation, and avoid
  inventing version-dependent details.

| Task | Start here; follow the relevant details |
| --- | --- |
| Understand the programming model | [System One](https://docs.typesafe.ai/concepts/system-one.md), [building guide](https://docs.typesafe.ai/concepts/how-to-build-with-system-one.md) |
| Explore what to build | [Use-case map](https://docs.typesafe.ai/concepts/use-case-map.md), then relevant cookbooks from the index |
| Prepare inputs and questions | [State](https://docs.typesafe.ai/concepts/state.md), [primitives](https://docs.typesafe.ai/primitives.md), then the chosen primitive's page |
| Decide how to handle uncertainty | [Confidence](https://docs.typesafe.ai/confidence.md) |
| Write API code | [HTTP API](https://docs.typesafe.ai/api.md), [Python SDK](https://docs.typesafe.ai/sdk/python.md), or [JavaScript SDK](https://docs.typesafe.ai/sdk/javascript.md) |
| Update an older integration | [Migration guide](https://docs.typesafe.ai/migrating-to-v1.md) and the installed SDK's current reference |

## Find the useful shape

Start from the behavior the user wants: what will the application show, select,
change, or hand off? Work backward to the judgments it needs. Keep known rules,
calculations, exact lookups, and execution in code. Preserve the user's chosen stack
and scope; add TypeSafe where semantic understanding helps.

When brainstorming or choosing an architecture, consider more than classification.
The patterns below are starting points: combine primitives around the user's goal,
including ideas that do not fit an established recipe.

- **Route and fill known arguments.** A request can select a handler and its typed
  parameters. Ask useful branch-specific questions up front and consume only the
  relevant answers. Explore [function calling](https://docs.typesafe.ai/cookbooks/function_calling.md)
  and [speculative fan-out](https://docs.typesafe.ai/patterns/fan-out.md).
- **Select instead of generate.** Find candidate values or source spans in code,
  use a judgment to select the intended one, then copy or normalize it. Code can
  also assemble source text into a formatted document or reading guide. Explore
  [value extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook.md)
  and [structure recovery](https://docs.typesafe.ai/cookbooks/autoformat.md).
- **Find and judge evidence.** Retrieve candidates, compare their relevance to a
  query, and select useful context. Explore [reranking](https://docs.typesafe.ai/cookbooks/rerank_typesafe.md)
  and [hierarchical classification](https://docs.typesafe.ai/cookbooks/hierarchical_classification.md).
- **Turn judgments into reusable data.** Score dimensions once, then let code or
  user controls change weights, thresholds, rankings, and views. With labeled
  outcomes, those signals can become classical ML features. Explore
  [composite scoring](https://docs.typesafe.ai/patterns/composite-scoring.md) and
  [feature discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery.md).
- **Verify and escalate.** Check specific claims or fields against their evidence;
  send uncertain or failing cases to a person or reasoning model. Explore
  [citation checks](https://docs.typesafe.ai/cookbooks/citation_check.md) and
  [extraction cascades](https://docs.typesafe.ai/cookbooks/sde_cascade.md).
- **Respond to changing state.** Code can retain goals and observations while fresh
  judgments guide the next bounded step. Keep inferred state distinct from observed
  facts, and check freshness before applying a result to a changed situation.

For open-ended requests, offer the few directions that best serve the user's goal
and recommend a starting point. For a concrete request, choose the relevant pattern
and build; a brainstorm is not a mandatory detour.

## Design the judgments

Choose by what the answer means, then read the relevant primitive page:

| Need | Primitive | Important distinction |
| --- | --- | --- |
| One of a defined set | [Choice](https://docs.typesafe.ai/primitives/choice.md) | Picks one option; its distribution compares competing options |
| Whether a condition holds | [Noul](https://docs.typesafe.ai/primitives/noul.md) | Probability of yes; no separate confidence; use one per label when several may apply |
| Degree along a described dimension | [Score](https://docs.typesafe.ai/primitives/score.md) | Probability-weighted position on ordered levels; use comparable per-item Scores for graded ranking |

Give each question enough relevant **state** to answer: source text, identities,
relationships, policies, and current facts. Prefer named JSON fields when context
has several parts. Put the judgment in **instructions** and define its possible
answers in **criteria**. Question IDs are for code and are not sent to the model;
include complete meaning in the question. Reference nested state with backticked
paths such as `ticket.messages[0].text`.

Ask one narrow, coherent judgment per question. Split independently useful dimensions,
without destroying the relationship being judged. A bounded action selection or
contextual interpretation is valid; atomic does not mean literal fact extraction
or a one-sentence limit. Strings work for simple questions. Use structured objects
or arrays when definitions, contrasts, exclusions, or examples clarify instructions
or criteria. Score levels must describe concrete situations and stand on their own.

Keep the needed answers available. Include a no-match outcome when nothing may fit;
use a separate presence judgment when it is independently useful. For source-value
selection, check candidate coverage: the model cannot choose an omitted value.

## Compose and verify

**Ask independent questions over the same state together**, including useful
speculative questions. They run in parallel and cannot see one another's answers.
State each speculative premise explicitly; code consumes the applicable answers.
A second request is warranted when an earlier answer is needed to fetch evidence,
construct new state, or determine the next options. Extra questions still use tokens;
measure actual request budgets, cost, and end-to-end latency.

Use probabilities and confidence to guide behavior, with thresholds evaluated on
the user's data and consequences. Choice/Score confidence summarizes distribution
concentration, not overall workflow correctness or permission to act. A Noul near
0.5 means similar probability for yes and no, not medium intensity. Several
acceptable alternatives can also spread probability; low confidence need not
invalidate a harmless preference choice. Ignore uncertainty on unused branches.

Keep policy explicit and raw judgments reusable. Weighted scores suit compensating
preferences; an "any serious violation" rule needs separate conditions. Changing a
weight or display filter need not rerun inference when evidence and question meanings
are unchanged. Typed output guarantees the interface, not truth. System One models
are trained for calibrated decisions; validate their performance in the target domain.

Test representative cases and the resulting application behavior. For failures,
inspect the exact state, questions, candidates, answers, composition, and observed
outcome. Separate missing evidence, model errors, code errors, and service failures.
Treat cookbook thresholds and demo results as examples to evaluate, not universal
rules or permanent model limitations. Keep API credentials server-side in web apps.

---

# Deployment configuration

Everything in this section ships with the skill — the endpoint, model IDs, schemas
and error strings below were verified by making real calls against the live API.
**The one thing you must supply yourself is the API key:** no key is bundled, so
this skill is safe to publish, share and copy between platforms.

## Credentials and endpoint

| | |
| --- | --- |
| Base URL | `https://openrouter.ai/api` |
| Endpoint | `POST https://openrouter.ai/api/v1/systemone` |
| API key | not bundled — read it from the `OPENROUTER_API_KEY` environment variable |
| Model | `typesafe/jev-1.13` (alias `~typesafe/jev-latest`) |

Auth header: `Authorization: Bearer $OPENROUTER_API_KEY`.

Create a key at <https://openrouter.ai/keys>, then expose it to whatever process
runs the code — before starting `dsh`, not after:

```bash
export OPENROUTER_API_KEY=sk-or-v1-...        # macOS / Linux
```

```powershell
$env:OPENROUTER_API_KEY = "sk-or-v1-..."      # Windows PowerShell
```

**Never paste the key into source, a prompt, a skill file, or a commit.** Read it
from the environment at call time; every sample below already does. If a call
returns `401`, the variable is unset in that process — see Troubleshooting.

The model ID routes to a dated build; responses come back naming it explicitly,
for example `"model": "typesafe/jev-1.13-20260917"`. That is expected.

There is a second endpoint, `POST https://openrouter.ai/api/alpha/decisions`, and
TypeSafe's own host at `POST https://api.typesafe.ai/v1/systemone` (that one needs a
TypeSafe account; this package uses OpenRouter instead).

## Billing and limits

- **Input** is billed at **$0.042 per 1M tokens**. **Output tokens are free.**
- Every response carries the real charge in `usage.cost` (USD). A minimal call
  costs roughly `$0.000012`; a call with 700+ input tokens about `$0.00003`.
- **Context limit is 32,000 tokens for `state` + `questions` combined.**
- Region note: with a mainland-China billing address OpenRouter refuses OpenAI,
  Anthropic and Google models but leaves every other model available. **Jev is
  TypeSafe's own model and is not on that list** — it works either way.

## Request and response shape

```json
{
  "model": "typesafe/jev-1.13",
  "state":   { "...named fields the questions can reference...": "..." },
  "questions": {
    "<your-question-id>": { "type": "...", "instructions": "...", "criteria": ... }
  }
}
```

```json
{
  "model": "typesafe/jev-1.13-20260917",
  "answers": {
    "<your-question-id>": { "type": "choice", "choice": "order_status",
                            "probabilities": { "order_status": 0.59 },
                            "confidence": 0.38 }
  },
  "usage": { "input_tokens": 364, "output_tokens": 41, "cost": 0.000015288 },
  "id": "gen-dec-1790907208-W244zs5UpeQDyEI7dyY8",
  "provider": "TypeSafe"
}
```

## The three primitives (verified)

**Noul** — probability that a condition holds.

```json
{ "type": "noul", "instructions": "Is this message a shipping question?" }
```
→ `{ "type": "noul", "noul": 0.47 }` — a value from 0 to 1. No separate confidence.

**Choice** — pick one of a defined set. `criteria` is an **object** keyed by option name.

```json
{
  "type": "choice",
  "instructions": "Primary intent of this customer message",
  "criteria": {
    "order_status": "Asking about an existing order or its tracking",
    "product_question": "Asking about a product before buying",
    "complaint": "Unhappy with the experience, wants resolution",
    "other": "None of the above"
  }
}
```
→ `{ "type": "choice", "choice": "order_status",
     "probabilities": { "order_status": 0.59, "product_question": 0.39, "other": 0.02 },
     "confidence": 0.38 }`

**Score** — position along ordered levels. `criteria` is an **array of objects**.

```json
{
  "type": "score",
  "instructions": "How urgent is this conversation for support",
  "criteria": [
    { "label": "not urgent", "description": "No time pressure; a later reply is fine" },
    { "label": "normal",    "description": "Wants an answer soon, a few hours is acceptable" },
    { "label": "urgent",    "description": "A hard deadline or strong emotion; handle now" }
  ]
}
```
→ `{ "type": "score", "score": 2,
     "legend": { "0": {"label": "not urgent", ...}, "1": {...}, "2": {...} },
     "probabilities": { "0": 0, "1": 0, "2": 1 },
     "confidence": 1 }`

`score` is the probability-weighted position; `legend` maps indices back to levels.

### The two gotchas that cost 400s

`criteria` has **opposite** types on Choice and Score. Sending the wrong one fails:

- Choice with an **array** → `Invalid input: expected record, received array`
- Score with an **object** → `Invalid input: expected array, received object`

## Calling it

### curl (verified)

```bash
curl -sS https://openrouter.ai/api/v1/systemone \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"typesafe/jev-1.13",
       "state":{"message":"Do you ship to Canada?"},
       "questions":{"intent":{"type":"noul",
                              "instructions":"Is this a shipping question?"}}}'
```

### JavaScript, Node 18+ (verified)

```js
const res = await fetch("https://openrouter.ai/api/v1/systemone", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "typesafe/jev-1.13",
    state: { message: "Hi, do you ship to Canada? Also my order still has no tracking." },
    questions: {
      intent: {
        type: "choice",
        instructions: "Primary intent of this customer message",
        criteria: {
          shipping_question: "Asking whether shipping to a location is possible",
          order_status: "Asking about an existing order or its tracking",
          other: "None of the above"
        }
      }
    }
  })
});
const data = await res.json();
const intent = data.answers.intent;   // { choice, probabilities, confidence }
```

### PHP

```php
<?php
$payload = json_encode([
    'model'     => 'typesafe/jev-1.13',
    'state'     => ['message' => $visitorMessage],
    'questions' => [
        'intent' => [
            'type'         => 'choice',
            'instructions' => 'Primary intent of this customer message',
            'criteria'     => [
                'order_status'     => 'Asking about an existing order or its tracking',
                'product_question' => 'Asking about a product before buying',
                'other'            => 'None of the above',
            ],
        ],
    ],
], JSON_UNESCAPED_UNICODE);

$ch = curl_init('https://openrouter.ai/api/v1/systemone');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . getenv('OPENROUTER_API_KEY'),
        'Content-Type: application/json',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 5,     // never let the model block the caller
    CURLOPT_CONNECTTIMEOUT => 3,
]);
$raw  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200 || !is_string($raw)) {
    return null;                     // degrade: keep the caller's flow going
}
$intent = json_decode($raw, true)['answers']['intent'] ?? null;
```

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| 401 `No auth credentials found` / `User not found` | `OPENROUTER_API_KEY` is unset or empty **in the process running the code**. Exporting it in another shell does not help: restart the process that makes the call. |
| Windows curl: `CRYPT_E_REVOCATION_OFFLINE (0x80092013)` | curl on Windows uses schannel and cannot reach the revocation list. Add `--ssl-no-revoke`. |
| Node `fetch` fails with `ECONNRESET` or `UND_ERR_CONNECT_TIMEOUT` while curl works | **Node does not use the system proxy.** If the machine reaches the internet through one, set `HTTPS_PROXY=http://127.0.0.1:<port>` and run node with `NODE_USE_ENV_PROXY=1`. |
| 400 `expected record, received array` | `Choice.criteria` must be an **object**, not an array. |
| 400 `expected array, received object` | `Score.criteria` must be an **array of objects**, not an object. |
| 402 / 429 / insufficient credits | Stop calling. Do not retry, rewrite the request, or route around it with another model. Report to the operator. |

## Conventions worth keeping

- **Never let the judgment block the workflow.** Give it a timeout and a fallback
  path; a failed judgment should leave the surrounding feature working.
- **Keep the key server-side.** In a web app the browser must never see it.
- **One call per new input, not per poll.** Asking on every poll cycle re-bills
  the same message over and over.
