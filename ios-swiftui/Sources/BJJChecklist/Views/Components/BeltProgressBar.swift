import SwiftUI

public struct BeltProgressBar: View {
    let belt: Belt
    let progress: BeltProgress

    public init(belt: Belt, progress: BeltProgress) {
        self.belt = belt
        self.progress = progress
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .firstTextBaseline) {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Text("Faixa \(belt.name)")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.primary)

                        if progress.isCompleted {
                            Label("100% Concluída", systemImage: "checkmark.seal.fill")
                                .font(.caption.bold())
                                .foregroundColor(.green)
                        }
                    }

                    Text(progress.formattedCount)
                        .font(.system(size: 13, weight: .regular))
                        .foregroundColor(.secondary)
                }

                Spacer()

                Text(progress.formattedPercentage)
                    .font(.system(size: 24, weight: .heavy, design: .rounded))
                    .foregroundColor(belt.color)
            }

            // Progress Bar Track & Fill
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(belt.lightColor)
                        .frame(height: 12)

                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [belt.color, belt.color.opacity(0.85)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: max(geo.size.width * CGFloat(progress.percentage), progress.completedCount > 0 ? 12 : 0), height: 12)
                        .animation(.spring(response: 0.5, dampingFraction: 0.75), value: progress.percentage)
                }
            }
            .frame(height: 12)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color.appSecondarySystemBackground)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(belt.color.opacity(0.15), lineWidth: 1)
        )
        .padding(.horizontal, 16)
    }
}
