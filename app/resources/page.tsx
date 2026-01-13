import { ResourceCard } from "@/components/resources/ResourceCard";
import { YouTubeChannelCard } from "@/components/resources/YouTubeChannelCard";
import { BookCard } from "@/components/resources/BookCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const resources = [
  {
    title: "⭐ Awesome Godot",
    description: "Curated list of Godot tools, assets, and learning resources.",
    url: "https://github.com/godotengine/awesome-godot",
    urlLabel: "https://github.com/godotengine/awesome-godot",
  },
];

const youtubeChannels = [
  {
    name: "GDQuest",
    url: "https://www.youtube.com/@Gdquest",
    description:
      "Comprehensive tutorials and courses on Godot, covering various aspects of game development.",
  },
  {
    name: "HeartBeast",
    url: "https://www.youtube.com/@uheartbeast",
    description: "In-depth tutorials and complete courses on creating games with Godot.",
  },
  {
    name: "Brackeys",
    url: "https://www.youtube.com/@Brackeys",
    description: "High-quality game development tutorials, including content on Godot.",
  },
  {
    name: "StayAtHomeDev",
    url: "https://www.youtube.com/@StayAtHomeDev",
    description: "Tutorials and showcases for game development using the Godot Engine.",
  },
  {
    name: "ClearCode",
    url: "https://www.youtube.com/@clear_code",
    description:
      "Tutorials and insights into software development, including Godot game development.",
  },
];

const tutorials = [
  {
    name: "GDQuest Tutorials",
    url: "https://www.gdquest.com/tutorial/godot/",
    description:
      "Large collection of free tutorials and courses for Godot, with techniques you will not find anywhere else. Includes learning paths for beginners and developers, covering 2D games, 3D games, GDScript, shaders, and more.",
  },
];

const assetLibraries = [
  {
    name: "Godot Asset Library",
    url: "https://godotengine.org/asset-library/",
    description:
      "Official collection of assets tailored for the Godot Engine, including scripts, plugins, and more.",
  },
  {
    name: "itch.io assets",
    url: "https://itch.io/game-assets",
    description:
      "Vast marketplace offering a wide range of game assets, from 2D sprites to 3D models, suitable for various game development needs.",
  },
  {
    name: "Kenney.nl",
    url: "https://kenney.nl/",
    description:
      "High-quality, free game assets covering 2D sprites, 3D models, audio, and more, all available under a public domain license.",
  },
];

const books = [
  {
    title: "Game Programming Patterns",
    url: "https://gameprogrammingpatterns.com",
    whatItTeaches:
      "Software architecture for games — game loops, state machines, event queues, component systems.",
    whyItMatters:
      "You'll write cleaner, scalable systems instead of tangled logic.",
    greatFor: "all levels • Also available free online",
  },
  {
    title: "Game Engine Architecture",
    author: "Jason Gregory",
    whatItTeaches:
      "How real game engines handle animation, rendering, physics, asset management, threading.",
    whyItMatters:
      "It's practical systems engineering — perfect if you want to understand what's under the hood.",
    greatFor: "intermediate → advanced",
  },
  {
    title: "The Art of Game Design: A Book of Lenses",
    author: "Jesse Schell",
    whatItTeaches: "Game design fundamentals — mechanics, player psychology, fun, iteration.",
    whyItMatters: "This isn't code — it's why games feel good.",
    greatFor: "designers & programmers alike",
  },
  {
    title: "Level Up! The Guide to Great Video Game Design",
    author: "Scott Rogers",
    whatItTeaches:
      "Concrete design insights: level design, feedback loops, pacing, character balance.",
    whyItMatters: "It's practical and actionable — especially for 2D & indie games.",
    greatFor: "beginners → intermediate",
  },
  {
    title: "Fundamentals of Game Design",
    authors: "Ernest Adams & Andrew Rollings",
    whatItTeaches:
      "Foundations of gameplay, storytelling, balancing, metrics, and systems design.",
    whyItMatters: "Broad and deep — perfect if you want theory + practice.",
    greatFor: "anyone serious about game design",
  },
  {
    title: "Designing Games: A Guide to Engineering Experiences",
    author: "Tynan Sylvester",
    url: "https://tynansylvester.com/book/",
    whatItTeaches:
      "Game mechanics that evoke emotions, narrative integration, multiplayer interactions, reward systems, and iterative design processes.",
    whyItMatters:
      "Focuses on engineering emotionally engaging player experiences through elegant mechanics and compelling design.",
    greatFor: "designers & developers who want to understand player psychology",
  },
];

const other = [
  {
    name: "Godot Forum",
    url: "https://forum.godotengine.org/",
    description:
      "A place for the Godot community to meet, ask questions, share their work, and provide help to other users.",
  },
  {
    name: "Godot Cafe",
    url: "https://discord.com/invite/zH7NUgz",
    description: "Community Discord server with 80k+ members for Godot developers to chat and share knowledge.",
  },
  {
    name: "Godot Engine Discord",
    url: "https://discord.com/invite/godotengine",
    description: "Official Godot Engine Discord server with 60k+ members for community support and discussions.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="container py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
        <p className="text-muted-foreground">
          Curated collection of tools, assets, and learning materials to help you on your Godot
          journey.
        </p>
      </div>

      <div className="space-y-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.title}
            title={resource.title}
            description={resource.description}
            url={resource.url}
            urlLabel={resource.urlLabel}
          />
        ))}

        <Accordion
          type="multiple"
          className="w-full space-y-4"
          defaultValue={["tutorials", "youtube-channels", "asset-libraries", "books", "other"]}
        >
          <AccordionItem value="tutorials" className="border rounded-lg px-4">
            <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
              📖 Tutorials
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {tutorials.map((tutorial) => (
                  <YouTubeChannelCard
                    key={tutorial.name}
                    name={tutorial.name}
                    url={tutorial.url}
                    description={tutorial.description}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="youtube-channels" className="border rounded-lg px-4">
            <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
              🎥 YouTube Channels
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {youtubeChannels.map((channel) => (
                  <YouTubeChannelCard
                    key={channel.name}
                    name={channel.name}
                    url={channel.url}
                    description={channel.description}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="asset-libraries" className="border rounded-lg px-4">
            <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
              📦 Asset Libraries
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {assetLibraries.map((library) => (
                  <YouTubeChannelCard
                    key={library.name}
                    name={library.name}
                    url={library.url}
                    description={library.description}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="books" className="border rounded-lg px-4">
            <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
              📚 Books
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {books.map((book) => (
                  <BookCard
                    key={book.title}
                    title={book.title}
                    author={book.author}
                    authors={book.authors}
                    url={book.url}
                    whatItTeaches={book.whatItTeaches}
                    whyItMatters={book.whyItMatters}
                    greatFor={book.greatFor}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="other" className="border rounded-lg px-4">
            <AccordionTrigger className="text-2xl font-semibold hover:no-underline">
              🔗 Other
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {other.map((item) => (
                  <YouTubeChannelCard
                    key={item.name}
                    name={item.name}
                    url={item.url}
                    description={item.description}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
