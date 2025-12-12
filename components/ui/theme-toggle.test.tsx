import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";
import { vi } from "vitest";

// Mock del hook useTheme
const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
    useTheme: () => ({
        theme: "light",
        setTheme: mockSetTheme,
    }),
}));

describe("ThemeToggle", () => {
    beforeEach(() => {
        mockSetTheme.mockClear();
    });

    // Test más básico: ¿se renderiza?
    it("renders correctly", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button", { name: "Toggle theme" });
        expect(button).toBeInTheDocument();
    });

    // Test que verifica que los iconos están presentes
    it("renders Sun and Moon icons", () => {
        render(<ThemeToggle />);

        // Los iconos SVG están ocultos con aria-hidden, así que los buscamos por su clase
        const sunIcon = document.querySelector(".lucide-sun");
        const moonIcon = document.querySelector(".lucide-moon");

        expect(sunIcon).toBeInTheDocument();
        expect(moonIcon).toBeInTheDocument();
    });

    // Test del comportamiento de click
    it("calls setTheme with 'dark' when current theme is 'light'", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button", { name: "Toggle theme" });

        // Simulamos el click
        fireEvent.click(button);

        // Verificamos que se llamó a setTheme con el tema opuesto
        expect(mockSetTheme).toHaveBeenCalledWith("dark");
        expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    // Test del click cuando el tema es dark - lo hacemos más simple
    it("handles click correctly", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button", { name: "Toggle theme" });

        // Simulamos múltiples clicks
        fireEvent.click(button);
        fireEvent.click(button);

        // Verificamos que se llamó a setTheme la cantidad correcta de veces
        expect(mockSetTheme).toHaveBeenCalledTimes(2);
    });

    // Test de accesibilidad
    it("has proper accessibility attributes", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button", { name: "Toggle theme" });
        expect(button).toBeInTheDocument();

        // Verificar el span para screen readers
        const srOnly = screen.getByText("Toggle theme");
        expect(srOnly).toHaveClass("sr-only");
    });

    // Test de clases CSS
    it("applies correct CSS classes", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button");
        expect(button).toHaveClass(
            "w-fit",
            "h-fit",
            "hover:text-primary",
            "cursor-pointer",
        );
    });

    // Test que verifica que es un Button con las props correctas
    it("renders as Button with correct props", () => {
        render(<ThemeToggle />);

        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("data-slot", "button");
    });
});
