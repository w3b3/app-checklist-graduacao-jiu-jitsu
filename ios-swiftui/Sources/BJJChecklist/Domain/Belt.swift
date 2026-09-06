import SwiftUI

public struct Belt: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let colorHex: String
    public let textHex: String
    public let lightHex: String
    public let order: Int

    public init(
        id: String,
        name: String,
        colorHex: String,
        textHex: String,
        lightHex: String,
        order: Int
    ) {
        self.id = id
        self.name = name
        self.colorHex = colorHex
        self.textHex = textHex
        self.lightHex = lightHex
        self.order = order
    }

    public var color: Color {
        Color(hex: colorHex)
    }

    public var textColor: Color {
        Color(hex: textHex)
    }

    public var lightColor: Color {
        Color(hex: lightHex)
    }

    public static let azul = Belt(
        id: "azul",
        name: "Azul",
        colorHex: "#1E40AF",
        textHex: "#1E3A8A",
        lightHex: "#DBEAFE",
        order: 1
    )

    public static let roxa = Belt(
        id: "roxa",
        name: "Roxa",
        colorHex: "#7C3AED",
        textHex: "#5B21B6",
        lightHex: "#EDE9FE",
        order: 2
    )

    public static let marrom = Belt(
        id: "marrom",
        name: "Marrom",
        colorHex: "#92400E",
        textHex: "#78350F",
        lightHex: "#FEF3C7",
        order: 3
    )

    public static let preta = Belt(
        id: "preta",
        name: "Preta",
        colorHex: "#1F2937",
        textHex: "#111827",
        lightHex: "#F3F4F6",
        order: 4
    )

    public static let defaultBelts: [Belt] = [.azul, .roxa, .marrom, .preta]
}

extension Color {
    public init(hex: String) {
        let cleanHex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: cleanHex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch cleanHex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
