// Component test for the Badge primitive: renders children and applies the requested tone.
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies the success tone class", () => {
    render(<Badge tone="success">Settled</Badge>);
    expect(screen.getByText("Settled")).toHaveClass("text-success");
  });

  it("applies the danger tone class", () => {
    render(<Badge tone="danger">Blocked</Badge>);
    expect(screen.getByText("Blocked")).toHaveClass("text-danger");
  });
});
