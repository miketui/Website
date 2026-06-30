import { describe, expect, it } from "vitest";
import { scoreQuiz, quizArchetypes, quizItems } from "@/content/funnels";
import { orEquals } from "@/lib/supabase/filters";

describe("quiz scoring", () => {
  it("offers one option per archetype on every question", () => {
    const slugs = quizArchetypes.map((a) => a.slug).sort();
    for (const item of quizItems) {
      expect(item.options).toHaveLength(4);
      expect(item.options.map((o) => o.archetype).sort()).toEqual(slugs);
    }
  });

  it("returns the most-selected archetype", () => {
    const target = quizArchetypes[2].slug;
    const answers = [target, target, target, target, quizArchetypes[0].slug, quizArchetypes[1].slug];
    expect(scoreQuiz(answers).slug).toBe(target);
  });

  it("breaks ties deterministically toward the earliest archetype", () => {
    expect(scoreQuiz([quizArchetypes[0].slug, quizArchetypes[1].slug]).slug).toBe(quizArchetypes[0].slug);
  });
});

describe("orEquals (PostgREST filter safety)", () => {
  it("quotes values and drops empties", () => {
    expect(orEquals([["user_id", "abc"], ["email", ""]])).toBe('user_id.eq."abc"');
    expect(orEquals([["user_id", "id1"], ["email", "a@b.co"]])).toBe('user_id.eq."id1",email.eq."a@b.co"');
  });

  it("neutralizes a comma in input so it cannot inject an extra or-branch", () => {
    expect(orEquals([["email", "x@y.com,role.eq.admin"]])).toBe('email.eq."x@y.com,role.eq.admin"');
  });
});
