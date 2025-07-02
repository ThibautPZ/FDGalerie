import OeuvreDisplay from "./OeuvreDisplay";

function OeuvresList({ oeuvresList }) {
  return (
    oeuvresList.length > 0 &&
    oeuvresList.map((oeuvre) => {
      return <OeuvreDisplay oeuvre={oeuvre} key={oeuvre.id} />;
    })
  );
}

export default OeuvresList;
