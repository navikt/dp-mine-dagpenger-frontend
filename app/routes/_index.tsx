import { type MetaFunction } from "@remix-run/node";
import { PageHero } from "~/components/page-hero/PageHero";
import { Section } from "~/components/section/Section";
import { SectionContent } from "~/components/section/SectionContent";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  return (
    <div className="mine-dagpenger">
      <PageHero hasFullforteSoknader={true} />
      <Section>
        <SectionContent>
          <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
            <h1>Welcome to Remix!</h1>
            <ul>
              <li>
                <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
                  15m Quickstart Blog Tutorial
                </a>
              </li>
              <li>
                <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer">
                  Deep Dive Jokes App Tutorial
                </a>
              </li>
              <li>
                <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
                  Remix Docs
                </a>
              </li>
            </ul>
          </div>
        </SectionContent>
      </Section>
    </div>
  );
}
