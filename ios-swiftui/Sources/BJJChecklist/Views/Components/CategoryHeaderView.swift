import SwiftUI

public struct CategoryHeaderView: View {
    let category: String
    let progress: CategoryProgress
    let isExpanded: Bool
    let beltColor: Color
    let onToggle: () -> Void

    public init(
        category: String,
        progress: CategoryProgress,
        isExpanded: Bool,
        beltColor: Color,
        onToggle: @escaping () -> Void
    ) {
        self.category = category
        self.progress = progress
        self.isExpanded = isExpanded
        self.beltColor = beltColor
        self.onToggle = onToggle
    }

    public var body: some View {
        Button(action: onToggle) {
            HStack(spacing: 8) {
                Text(category)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.primary)

                Spacer()

                Text(progress.formattedCount)
                    .font(.system(size: 13, weight: .semibold, design: .rounded))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(
                        Capsule()
                            .fill(progress.isCompleted ? Color.green.opacity(0.15) : Color.appTertiarySystemFill)
                    )
                    .foregroundColor(progress.isCompleted ? .green : .secondary)

                Image(systemName: "chevron.down")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.secondary)
                    .rotationEffect(.degrees(isExpanded ? 0 : -90))
                    .animation(.spring(response: 0.3, dampingFraction: 0.7), value: isExpanded)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(Color.appSystemBackground)
        }
        .buttonStyle(.plain)
    }
}
