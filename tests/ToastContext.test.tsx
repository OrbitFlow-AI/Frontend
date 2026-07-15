// Component test for ToastProvider: notifications appear on notify() and can be dismissed.
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToastProvider, useToast } from "@/lib/context/ToastContext";

function NotifyButton() {
  const { notify } = useToast();
  return <button onClick={() => notify("Payment settled.", "success")}>Trigger</button>;
}

describe("ToastProvider", () => {
  it("renders a toast after notify() is called", () => {
    render(
      <ToastProvider>
        <NotifyButton />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("Trigger"));
    expect(screen.getByText("Payment settled.")).toBeInTheDocument();
  });

  it("removes a toast when its dismiss button is clicked", () => {
    render(
      <ToastProvider>
        <NotifyButton />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("Trigger"));
    fireEvent.click(screen.getByLabelText("Dismiss notification"));
    expect(screen.queryByText("Payment settled.")).not.toBeInTheDocument();
  });

  it("throws when useToast is called outside a ToastProvider", () => {
    function Broken() {
      useToast();
      return null;
    }
    expect(() => render(<Broken />)).toThrow("useToast must be used within a ToastProvider");
  });
});
