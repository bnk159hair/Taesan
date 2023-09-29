package com.ts.taesan.domain.transaction.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ts.taesan.domain.analyst.service.dto.response.Info;
import com.ts.taesan.domain.transaction.entity.ReceiptList;
import com.ts.taesan.domain.transaction.service.dto.response.OftenCategory;
import com.ts.taesan.domain.transaction.service.dto.response.ReceiptDTO;
import com.ts.taesan.domain.transaction.service.dto.response.RecentTransaction;
import com.ts.taesan.domain.transaction.service.dto.response.TransactionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import static com.ts.taesan.domain.transaction.entity.QTransaction.transaction;
import static com.ts.taesan.domain.transaction.entity.QReceipt.receipt;
import static com.ts.taesan.domain.transaction.entity.QReceiptList.receiptList;

import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class TransactionQRepository {

    private final JPAQueryFactory queryFactory;

    public List<TransactionDTO> findTransactionListByCardId(Long id, Integer cursor, Integer limit){
        return queryFactory.select(Projections.fields(TransactionDTO.class,
                transaction.id.as("transactionId"), transaction.approvedId, transaction.dateTime,
                transaction.approvedAmount, transaction.afterTransAmt, transaction.shopName, transaction.category))
                .from(transaction).where(transaction.cardId.eq(id)).offset(cursor).limit(limit).orderBy(transaction.dateTime.desc()).fetch();
    }

    public TransactionDTO findTransactionDetailByCardId(Long id){
        return queryFactory.select(Projections.fields(TransactionDTO.class,
                transaction.id.as("transactionId"), transaction.approvedId, transaction.dateTime,
                transaction.approvedAmount, transaction.afterTransAmt, transaction.shopName, transaction.category,
                transaction.cardType, transaction.shopNumber)).from(transaction).where(transaction.id.eq(id)).fetchFirst();
    }

    public List<ReceiptDTO> findReceiptByTransactionId(Long id){
        return queryFactory.select(Projections.fields(ReceiptDTO.class,
                receiptList.price, receiptList.category, receiptList.name.as("productName"))).from(receiptList)
                .where(receiptList.receipt.transaction.id.eq(id)).fetch();
    }

    public RecentTransaction findRecentTransactionByCardId(Long id, LocalDate startDate){
        return queryFactory.select(Projections.fields(RecentTransaction.class, transaction.count().as("count"), transaction.approvedAmount.sum().as("sum")
                )).from(transaction).where(transaction.id.eq(id).and(transaction.dateTime.after(startDate.atStartOfDay()))).fetchFirst();
    }

    public List<TransactionDTO> findTransactionListByMonth(Long id, LocalDate startDate, LocalDate endDate, String category){
        return queryFactory.select(Projections.fields(TransactionDTO.class,
                        transaction.id.as("transactionId"), transaction.approvedId, transaction.dateTime,
                        transaction.approvedAmount, transaction.afterTransAmt, transaction.shopName, transaction.category))
                .from(transaction).where(transaction.cardId.eq(id).and(transaction.category.eq(category)
                        .and(transaction.dateTime.between(startDate.atStartOfDay(), endDate.atTime(23,59,59))))).fetch();
    }

    public List<ReceiptDTO> findReceiptsByMonth(Long id, LocalDate startDate, LocalDate endDate, String category){
        return queryFactory.select(Projections.fields(ReceiptDTO.class,
                receiptList.category, receiptList.price, receiptList.name.as("productName")
                )).from(receiptList).where(receiptList.receipt.transaction.cardId.eq(id)
                .and(receiptList.category.eq(category).and(receiptList.receipt.transactionDate
                        .between(startDate.atStartOfDay(), endDate.atTime(23,59,59))))).fetch();
    }

    public List<OftenCategory> findOftenTransaction(Long id, LocalDate startDate, LocalDate endDate){
        return queryFactory.select(Projections.fields(OftenCategory.class, transaction.category,
                        transaction.count().as("count"),transaction.approvedAmount.sum().as("money")
                )).from(transaction).where(transaction.cardId.eq(id).
                and(transaction.dateTime.between(startDate.atStartOfDay(), endDate.atTime(23,59,59))))
                .groupBy(transaction.category)
                .orderBy(transaction.count().desc()).limit(5).fetch();
    }

    public List<OftenCategory> findOftenReceipt(Long id, LocalDate startDate, LocalDate endDate){
        return queryFactory.select(Projections.fields(OftenCategory.class, receiptList.category,
                receiptList.count().as("count"), receiptList.price.sum().as("money"))).from(receiptList)
                .where(receiptList.receipt.transaction.cardId.eq(id)
                        .and(receiptList.receipt.transactionDate.between(startDate.atStartOfDay(), endDate.atTime(23,59,59))))
                .groupBy(receiptList.category)
                .orderBy(receiptList.count().desc()).limit(5).fetch();
    }

    public List<Info> findTransactionAnal(Long cardId, LocalDate startDate, LocalDate endDate){
        return queryFactory.select(Projections.fields(Info.class,
                transaction.category.as("id"),
                        transaction.category.as("label"),
                        transaction.approvedAmount.sum().as("value")

                        ))
                .from(transaction)
                .where(transaction.cardId.eq(cardId).and(transaction.dateTime.between(startDate.atStartOfDay(), endDate.atTime(23,59,59))))
                .groupBy(transaction.category)
                .fetch();
    }

    public List<Info> findReceiptAnal(Long cardId, LocalDate startDate, LocalDate endDate){
        return queryFactory.select(Projections.fields(Info.class,
                        receiptList.category.as("id"),
                        receiptList.category.as("label"),
                        receiptList.price.sum().as("value")

                ))
                .from(receiptList)
                .where(receiptList.receipt.transaction.cardId.eq(cardId).and(receiptList.receipt.transactionDate.between(startDate.atStartOfDay(), endDate.atTime(23,59,59))))
                .groupBy(receiptList.category)
                .fetch();
    }
}