import { render, screen } from "@testing-library/react";
import MainContainer from "./MainContainer";
import { PriceContext } from "./PriceContext";

const ctaMessages = {
  CTAPositive: "Buy",
  CTANeutral: "Hold forever",
  CTANegative: "Sell now"
};

function renderMainContainer({ openingPrice, closingPrice }) {
  const priceContextValue = {
    currentPrice: closingPrice,
    processedDataPoints: [{ price: openingPrice }, { price: closingPrice }],
    silverData: ctaMessages
  };

  return render(
    <PriceContext.Provider value={priceContextValue}>
      <MainContainer
        orderCounter={0}
        coinCounter={0}
        budget={50000}
        isLoading={false}
        isError={false}
      />
    </PriceContext.Provider>
  );
}

describe("MainContainer", () => {
  it("shows the initial account values and the supplied current price", () => {
    renderMainContainer({ openingPrice: 25, closingPrice: 27.5 });

    expect(screen.getByTestId("total-orders")).toHaveTextContent("0");
    expect(screen.getByTestId("coin-counter")).toHaveTextContent("0");
    expect(screen.getByTestId("budget")).toHaveTextContent("50000");
    expect(screen.getByTestId("current-price")).toHaveTextContent("$27.5");
  });

  it.each([
    ["equal opening and closing prices", 25, 25, ctaMessages.CTANeutral],
    ["opening price above closing price", 30, 25, ctaMessages.CTAPositive],
    ["opening price below closing price", 20, 25, ctaMessages.CTANegative]
  ])("shows the correct recommendation for %s", (_caseName, openingPrice, closingPrice, expectedMessage) => {
    renderMainContainer({ openingPrice, closingPrice });

    expect(screen.getByTestId("recommendation")).toHaveTextContent(expectedMessage);
    expect(screen.getByTestId("current-price")).toHaveTextContent(`$${closingPrice}`);
  });
});