import Deck from "./deck";

const DeckGallery = ({ decks }: { decks: any }) => {
  return (
    <div className="flex flex-col gap-4  container h-dvh ">
      <div className="h-16 mb-4" />
      <h1 className="text-4xl font-display mb-8">
        Deep topic <br />
        Deep connection
      </h1>

      <p className="text-xl font-display">Explore</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {decks.map((deck: any) => (
          <Deck key={deck.id} deck={deck} />
        ))}
      </div>
    </div>
  );
};

export default DeckGallery;
